import express, { Request, Response, Router } from "express";
import { pool } from "../index.js";
import authorise from "../middleware/authorise.js";

const router: Router = express.Router();

router.get("/", authorise, async (req: Request & { user?: { id: string } }, res: Response) => {
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

export default router;