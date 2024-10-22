import express, { Request, Response, Router } from "express";
import { pool } from "../index.js";
import authorise from "../middleware/authorise.js";

const router: Router = express.Router();

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

export default router;