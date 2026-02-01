import express, { Request, Response, Router } from "express";
import { pool } from "../index.js";
import authorise from "../middleware/authorise.js";
import { google } from 'googleapis';
import { pipeline } from "@xenova/transformers";
import redisClient from "../redisClient.js";

const router: Router = express.Router();

const youtube = google.youtube('v3');

let pipe: any;
const initPipeline = async () => {
  pipe = await pipeline('text-generation', 'Xenova/distilgpt2');
};
initPipeline();



router.get("/", authorise, async (req: Request & { user?: { id: string } }, res: Response) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorised" });
    }

    const result = await pool.query("SELECT AVG(journalentry_mood_score) as average_mood_score FROM journalentries WHERE user_id = $1", [req.user.id]);
    const averageMoodScore = result.rows[0].average_mood_score || 0;

    res.json({ averageMoodScore });

  } catch (error: unknown) {
    console.error(error instanceof Error ? error.message : "Unknown error");
    res.status(500).json({ message: "Server Error" });
  }
});

router.get('/youtube-search', async (req: Request<{}, {}, {}, { query?: string }>, res: Response) => {
  try {
    const query = req.query.query;
    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }

    const cacheKey = `youtube_search:${query}`;
    try {
      const cachedVideoId = await redisClient.get(cacheKey);
      if (cachedVideoId) {
        return res.json({ videoId: cachedVideoId });
      }
    } catch (cacheError) {
      console.error('Redis get error:', cacheError);
      // Continue to API search if cache fails
    }

    if (!process.env.YOUTUBE_API_KEY) {
      throw new Error("YouTube API key is not configured");
    }

    const output = await pipe(`Generate a specific YouTube search query for: ${query}. Focus on helpful, educational content.`, {
      max_new_tokens: 50,
      temperature: 0.7
    });

    const searchQuery = output[0].generated_text;

    if (!searchQuery) {
      return res.status(500).json({ message: "Failed to generate search query" });
    }

    const response = await youtube.search.list({
      key: process.env.YOUTUBE_API_KEY,
      part: ['snippet'],
      q: searchQuery,
      maxResults: 1,
      type: ['video'],
      videoEmbeddable: 'true',
      safeSearch: 'strict'
    });

    const videoId = response.data.items?.[0]?.id?.videoId;
    if (!videoId) {
      return res.status(404).json({ message: "No video found" });
    }

    // 24 hour cache
    try {
      await redisClient.set(cacheKey, videoId, {
        EX: 86400
      });
    } catch (cacheError) {
      console.error('Redis set error:', cacheError);
    }

    return res.json({ videoId });

  } catch (error) {
    console.error('YouTube search error:', error);
    return res.status(500).json({ message: "Error fetching video" });
  }
});




export default router;