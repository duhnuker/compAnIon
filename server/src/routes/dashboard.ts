import express, { Request, Response, Router } from "express";
import { Pool, QueryResult } from "pg";
import { pool } from "../index";
import authMiddleware from "../middleware/authorise";

const router: Router = express.Router();

interface User {
  name: string;
}

router.get("/", authMiddleware, async (req: Request & { user?: { id: string } }, res: Response) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const result: QueryResult<User> = await pool.query<User>("SELECT name FROM Users WHERE id = $1", [req.user.id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user: User = result.rows[0];
    res.json({ name: user.name });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ message: "Server Error" });
  }
});
export default router;
