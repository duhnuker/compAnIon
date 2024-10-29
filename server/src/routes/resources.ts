import express, { Request, Response, Router } from "express";
import { pool } from "../index.js";
import authorise from "../middleware/authorise.js";
import { google } from 'googleapis';
import OpenAI from 'openai';

const router: Router = express.Router();

const youtube = google.youtube('v3');

const openai = new OpenAI(({
  apiKey: process.env.OPENAI_API_KEY
}));


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
    if (!req.query.query) {
      return res.status(400).json({ message: "Search query is required" });
    }

    if (!process.env.YOUTUBE_API_KEY) {
      throw new Error("YouTube API key is not configured");
    }

    const completion = await openai.completions.create({
      model: "text-davinci-003",
      prompt: `Generate a specific YouTube search query for: ${req.query.query}. Focus on helpful, educational content.`,
      max_tokens: 50,
      temperature: 0.7
    });

    const searchQuery = completion.choices[0]?.text?.trim();

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

    return res.json({ videoId });
  } catch (error) {
    console.error('YouTube search error:', error);
    return res.status(500).json({ message: "Error fetching video" });
  }
});




export default router;