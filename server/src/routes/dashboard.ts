import express, { Request, Response, Router } from "express";
import { Pool, QueryResult } from "pg";
import { pool } from "../index.js";
import authorise from "../middleware/authorise.js";
import { analyseSentiment } from "../ai/sentimentAnalyser.js";

const router: Router = express.Router();

//Get user name and entries
router.get("/", authorise, async (req: Request & { user?: { id: string } }, res: Response) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorised" });
    }

    const user = await pool.query("SELECT users.user_name, users.user_id, journalentries.journalentry_id, journalentries.journalentry_text, journalentries.journalentry_mood, journalentries.journalentry_mood_score, journalentries.journalentry_created_at FROM users LEFT JOIN journalentries ON users.user_id = journalentries.user_id WHERE users.user_id = $1", [req.user.id]);
    res.json(user.rows);

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

//Edit a journal entry
router.put("/journalentry/:id", authorise, async (req: Request & { user?: { id: string } }, res: Response) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorised" });
    }

    const { journalentry_text } = req.body;
    const { id } = req.params;

    //Updated text sentiment analysis
    const entryMood = await analyseSentiment(journalentry_text);

    const editJournalEntry = await pool.query("UPDATE journalentries SET journalentry_text = $1, journalentry_mood = $4, journalentry_mood_score = $5 WHERE journalentry_id = $2 AND user_id = $3 RETURNING *", [journalentry_text, id, req.user.id, entryMood.label, entryMood.score]);

    if (editJournalEntry.rows.length === 0) {
      return res.status(404).json({ message: "This journal entry is not yours or does not exist" });
    }

    res.json({ message: "Journal Entry was updated" });

  } catch (error: unknown) {
    console.error("Detailed error:", error);
    console.error(error instanceof Error ? error.message : "Unknown error");
    res.status(500).json({ message: "Server Error" });
  }
});

//Delete a journal entry
router.delete("/journalentry/:id", authorise, async (req: Request & { user?: { id: string } }, res: Response) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorised" });
    }

    const { id } = req.params;
    const deleteJournalEntry = await pool.query("DELETE FROM journalentries WHERE journalentry_id = $1 AND user_id = $2 RETURNING *", [id, req.user.id]);

    if (deleteJournalEntry.rows.length === 0) {
      return res.json("This journal entry is not yours");
    }

    res.json("Journal entry was deleted");

  } catch (error: unknown) {
    console.error(error instanceof Error ? error.message : "Unknown error");
  }
});

//Get user mood score data
router.get("/yourprogress", authorise, async (req: Request & { user?: { id: string } }, res: Response) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorised" });
    }

    const user = await pool.query("SELECT users.user_name, users.user_id, journalentries.journalentry_mood_score, journalentries.journalentry_created_at FROM users LEFT JOIN journalentries ON users.user_id = journalentries.user_id WHERE users.user_id = $1 ORDER BY journalentry_created_at ASC", [req.user.id]);
    res.json(user.rows);

  } catch (error: unknown) {
    console.error(error instanceof Error ? error.message : "Unknown error");
    res.status(500).json({ message: "Server Error" });
  }
});

//Get average mood score for resources route
router.get("/resources", authorise, async (req: Request & { user?: { id: string } }, res: Response) => {
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


export default router;

