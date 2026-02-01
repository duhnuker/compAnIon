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
const router = express.Router();
router.get("/", authorise, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "Unauthorised" });
        }
        const user = yield pool.query("SELECT users.user_name, users.user_id, journalentries.journalentry_mood_score, journalentries.journalentry_created_at FROM users LEFT JOIN journalentries ON users.user_id = journalentries.user_id WHERE users.user_id = $1 ORDER BY journalentry_created_at ASC", [req.user.id]);
        res.json(user.rows);
    }
    catch (error) {
        console.error(error instanceof Error ? error.message : "Unknown error");
        res.status(500).json({ message: "Server Error" });
    }
}));
export default router;
