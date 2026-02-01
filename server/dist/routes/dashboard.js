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
import { analyseSentiment } from "../ai/sentimentAnalyser.js";
const router = express.Router();
//Get user profile
router.get("/", authorise, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "Unauthorised" });
        }
        const user = yield pool.query("SELECT user_name, user_id FROM users WHERE user_id = $1", [req.user.id]);
        res.json(user.rows[0]);
    }
    catch (error) {
        console.error(error instanceof Error ? error.message : "Unknown error");
        res.status(500).json({ message: "Server Error" });
    }
}));
//Create a journal entry
router.post("/journalentry", authorise, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "Unauthorised" });
        }
        const { journalEntry } = req.body;
        //Journal Entry sentiment analysis
        const entryMood = yield analyseSentiment(journalEntry);
        const newJournalEntry = yield pool.query("INSERT INTO journalentries (user_id, journalentry_text, journalentry_mood, journalentry_mood_score) VALUES ($1, $2, $3, $4) RETURNING *", [req.user.id, journalEntry, entryMood.label, entryMood.score]);
        res.json(newJournalEntry.rows[0]);
    }
    catch (error) {
        console.error(error instanceof Error ? error.message : "Unknown error");
        res.status(500).json({ error: "An error occurred while creating the journal entry" });
    }
}));
export default router;
