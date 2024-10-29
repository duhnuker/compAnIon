import express, { Request, Response, Router } from "express";
import { pool } from "../index.js";
import authorise from "../middleware/authorise.js";
import { analyseSentiment } from "../ai/sentimentAnalyser.js";

const router: Router = express.Router();

//Get user profile
router.get("/", authorise, async (req: Request & { user?: { id: string } }, res: Response) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorised" });
    }

    const user = await pool.query(
      "SELECT user_name, user_id FROM users WHERE user_id = $1", 
      [req.user.id]
    );
    res.json(user.rows[0]);
    
  } catch (error: unknown) {
    console.error(error instanceof Error ? error.message : "Unknown error");
    res.status(500).json({ message: "Server Error" });
  }
});

//Create a journal entry
router.post("/journalentry", authorise, async (req: Request & { user?: { id: string } }, res: Response) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorised" });
    }

    const { journalEntry } = req.body;

    //Journal Entry sentiment analysis
    const entryMood = await analyseSentiment(journalEntry);

    const newJournalEntry = await pool.query("INSERT INTO journalentries (user_id, journalentry_text, journalentry_mood, journalentry_mood_score) VALUES ($1, $2, $3, $4) RETURNING *", [req.user.id, journalEntry, entryMood.label, entryMood.score]);

    res.json(newJournalEntry.rows[0]);
  } catch (error: unknown) {
    console.error(error instanceof Error ? error.message : "Unknown error");
    res.status(500).json({ error: "An error occurred while creating the journal entry"});
  }
});

export default router;