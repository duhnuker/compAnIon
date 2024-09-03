import express, { Request, Response, Router } from "express";
import { Pool, QueryResult } from "pg";
import { pool } from "../index";
import authMiddleware from "../middleware/authorise";

const router: Router = express.Router();

router.get("/", authMiddleware, async (req: Request & { user?: { id: string } }, res: Response) => {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const user = await pool.query("SELECT name FROM Users WHERE id = $1", [req.user.id]);
      res.json(user.rows[0]);

    } catch (error: unknown) {
      console.error(error instanceof Error ? error.message : "Unknown error");
      res.status(500).json({ message: "Server Error" });
    }
});

export default router;