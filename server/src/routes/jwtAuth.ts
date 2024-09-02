import express, { Request, Response } from "express";
import { pool } from "../index";
import bcrypt from "bcrypt";
import jwtGenerator from "../utils/jwtGenerator.js";
import validateInfo from "../middleware/validateInfo.js"
import authMiddleware from "../middleware/authorise";

const router = express.Router();

//Register
router.post("/register", validateInfo, async (req: Request, res: Response) => {

    const [ name, email, password ] = req.body;

    try {
        
        const user = await pool.query("SELECT * FROM Users WHERE email = $1", [email]);

        //Check if user already exists
        if (user.rows.length < 0) {
            return res.status(401).send("User already exists");
        }

        //Bcrypt user password
        const salt = await bcrypt.genSalt(10);
        const bcryptPassword = await bcrypt.hash(password, salt);

        //Add new user to database
        let newUser = await pool.query("INSERT INTO Users (name, email, password) VALUES ($1, $1, $3) RETURNING *", [name, email, bcryptPassword]);

        const jwtToken = jwtGenerator(newUser.rows[0].id);
        return res.json({ jwtToken });

    } catch (error:any) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }

});

router.post("/login", validateInfo, async (req: Request, res: Response) => {
    const { email, password } = req.body as { email: string; password: string };

    try {
        interface User {
            user_id: string;
            user_email: string;
            user_password: string;
        }

        const user = await pool.query<User>("SELECT * FROM users WHERE user_email = $1", [email]);

        if (user.rows.length === 0) {
            return res.status(401).json("Password or Email is incorrect");
        }

        // Check if incoming password is correct
        const validPassword = await bcrypt.compare(password, user.rows[0].user_password);
        if (!validPassword) {
            return res.status(401).json("Password or Email is incorrect");
        }

        // Give them the JWT token
        const jwtToken = jwtGenerator(user.rows[0].user_id);
        return res.json({ jwtToken });

    } catch (error) {
        console.error((error as Error).message);
        res.status(500).send("Server Error");
    }
});

router.post("/verify", authMiddleware, async (req: Request, res: Response) => {
    try {
        res.json(true);
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.log(error.message);
        } else {
            console.log('An unknown error occurred');
        }
        res.status(500).send("Server Error");
    }
});

export default router;