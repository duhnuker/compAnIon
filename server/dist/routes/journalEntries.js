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
// Get all journal entries
router.get("/", authorise, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "Unauthorised" });
        }
        const entries = yield pool.query("SELECT * FROM journalentries WHERE user_id = $1 ORDER BY journalentry_created_at DESC", [req.user.id]);
        res.json(entries.rows);
    }
    catch (error) {
        console.error(error instanceof Error ? error.message : "Unknown error");
        res.status(500).json({ message: "Server Error" });
    }
}));
// Get most recent journal entry
router.get("/recent", authorise, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "Unauthorised" });
        }
        const recentEntry = yield pool.query("SELECT * FROM journalentries WHERE user_id = $1 ORDER BY journalentry_created_at DESC LIMIT 1", [req.user.id]);
        res.json(recentEntry.rows[0]);
    }
    catch (error) {
        console.error(error instanceof Error ? error.message : "Unknown error");
        res.status(500).json({ message: "Server Error" });
    }
}));
//Edit a journal entry
router.put("/journalentry/:id", authorise, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "Unauthorised" });
        }
        const { journalentry_text } = req.body;
        const { id } = req.params;
        //Updated text sentiment analysis
        const entryMood = yield analyseSentiment(journalentry_text);
        const editJournalEntry = yield pool.query("UPDATE journalentries SET journalentry_text = $1, journalentry_mood = $4, journalentry_mood_score = $5 WHERE journalentry_id = $2 AND user_id = $3 RETURNING *", [journalentry_text, id, req.user.id, entryMood.label, entryMood.score]);
        if (editJournalEntry.rows.length === 0) {
            return res.status(404).json({ message: "This journal entry is not yours or does not exist" });
        }
        res.json({ message: "Journal Entry was updated" });
    }
    catch (error) {
        console.error("Detailed error:", error);
        console.error(error instanceof Error ? error.message : "Unknown error");
        res.status(500).json({ message: "Server Error" });
    }
}));
//Delete a journal entry
router.delete("/journalentry/:id", authorise, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "Unauthorised" });
        }
        const { id } = req.params;
        const deleteJournalEntry = yield pool.query("DELETE FROM journalentries WHERE journalentry_id = $1 AND user_id = $2 RETURNING *", [id, req.user.id]);
        if (deleteJournalEntry.rows.length === 0) {
            return res.json("This journal entry is not yours");
        }
        res.json("Journal entry was deleted");
    }
    catch (error) {
        console.error(error instanceof Error ? error.message : "Unknown error");
    }
}));
export default router;
