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
import bcrypt from "bcrypt";
import jwtGenerator from "../utils/jwtGenerator.js";
import validateInfo from "../middleware/validateInfo.js";
import authorise from "../middleware/authorise.js";
const router = express.Router();
//Register
router.post("/register", validateInfo, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = req.body;
    try {
        console.log("Starting registration process for:", email);
        const user = yield pool.query("SELECT * FROM users WHERE user_email = $1", [email]);
        console.log("User query completed");
        if (user.rows.length > 0) {
            return res.status(409).send("User already exists");
        }
        const salt = yield bcrypt.genSalt(10);
        const bcryptPassword = yield bcrypt.hash(password, salt);
        console.log("Password hashed successfully");
        let newUser = yield pool.query("INSERT INTO users (user_name, user_email, user_password) VALUES ($1, $2, $3) RETURNING *", [name, email, bcryptPassword]);
        console.log("New user created successfully");
        const jwtToken = jwtGenerator(newUser.rows[0].user_id);
        return res.json({ jwtToken });
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("Registration failed:", error.message);
            console.error("Full error:", error);
        }
        res.status(500).send("Server Error");
    }
}));
router.post("/login", validateInfo, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield pool.query("SELECT * FROM users WHERE user_email = $1", [email]);
        if (user.rows.length === 0) {
            return res.status(401).json("Password or Email is incorrect");
        }
        // Check if incoming password is correct
        const validPassword = yield bcrypt.compare(password, user.rows[0].user_password);
        if (!validPassword) {
            return res.status(401).json("Password or Email is incorrect");
        }
        // Give them the JWT token
        const jwtToken = jwtGenerator(user.rows[0].user_id);
        return res.json({ jwtToken });
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
}));
router.post("/verify", authorise, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.json(true);
        console.error("User verified");
    }
    catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
        }
        else {
            console.error('An unknown error occurred');
        }
        res.status(500).send("Server Error");
    }
}));
export default router;
