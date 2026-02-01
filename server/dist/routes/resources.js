var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import express from "express";
import { pool } from "../index.js";
import authorise from "../middleware/authorise.js";
import { google } from 'googleapis';
import { pipeline } from "@xenova/transformers";
import redisClient from "../redisClient.js";
const router = express.Router();
const youtube = google.youtube('v3');
let pipe;
const initPipeline = () => __awaiter(void 0, void 0, void 0, function* () {
    pipe = yield pipeline('text-generation', 'Xenova/distilgpt2');
});
initPipeline();
router.get("/", authorise, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "Unauthorised" });
        }
        const result = yield pool.query("SELECT AVG(journalentry_mood_score) as average_mood_score FROM journalentries WHERE user_id = $1", [req.user.id]);
        const averageMoodScore = result.rows[0].average_mood_score || 0;
        res.json({ averageMoodScore });
    }
    catch (error) {
        console.error(error instanceof Error ? error.message : "Unknown error");
        res.status(500).json({ message: "Server Error" });
    }
}));
router.get('/youtube-search', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const query = req.query.query;
        if (!query) {
            return res.status(400).json({ message: "Search query is required" });
        }
        // Try to get from cache first
        const cacheKey = `youtube_search:${query}`;
        try {
            const cachedVideoId = yield redisClient.get(cacheKey);
            if (cachedVideoId) {
                return res.json({ videoId: cachedVideoId });
            }
        }
        catch (cacheError) {
            console.error('Redis get error:', cacheError);
            // Continue to API search if cache fails
        }
        if (!process.env.YOUTUBE_API_KEY) {
            throw new Error("YouTube API key is not configured");
        }
        const output = yield pipe(`Generate a specific YouTube search query for: ${query}. Focus on helpful, educational content.`, {
            max_new_tokens: 50,
            temperature: 0.7
        });
        const searchQuery = output[0].generated_text;
        if (!searchQuery) {
            return res.status(500).json({ message: "Failed to generate search query" });
        }
        const response = yield youtube.search.list({
            key: process.env.YOUTUBE_API_KEY,
            part: ['snippet'],
            q: searchQuery,
            maxResults: 1,
            type: ['video'],
            videoEmbeddable: 'true',
            safeSearch: 'strict'
        });
        const videoId = (_c = (_b = (_a = response.data.items) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.id) === null || _c === void 0 ? void 0 : _c.videoId;
        if (!videoId) {
            return res.status(404).json({ message: "No video found" });
        }
        // Cache the result for 24 hours
        try {
            yield redisClient.set(cacheKey, videoId, {
                EX: 86400 // 24 hours
            });
        }
        catch (cacheError) {
            console.error('Redis set error:', cacheError);
        }
        return res.json({ videoId });
    }
    catch (error) {
        console.error('YouTube search error:', error);
        return res.status(500).json({ message: "Error fetching video" });
    }
}));
export default router;
