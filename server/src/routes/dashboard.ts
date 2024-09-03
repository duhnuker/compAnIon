import express, { Request, Response, Router } from "express";
import { Pool, QueryResult } from "pg";
import { pool } from "../index";
import authorise from "../middleware/authorise";

const router: Router = express.Router();

//Get user name and entries
router.get("/", authorise, async (req: Request & { user?: { id: string } }, res: Response) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorised" });
    }

    const user = await pool.query("SELECT name FROM users WHERE id = $1", [req.user.id]);
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
    const newJournalEntry = await pool.query("INSERT INTO journalentries (user_id, entry_text) VALUES ($1, $2) RETURNING *", [req.user.id, journalEntry]);

    res.json(newJournalEntry.rows[0]);
  } catch (error: unknown) {
    console.error(error instanceof Error ? error.message : "Unknown error");
  }
});

