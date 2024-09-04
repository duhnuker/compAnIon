import express, { Request, Response } from "express";
import { pool } from "../index";
import bcrypt from "bcrypt";
import jwtGenerator from "../utils/jwtGenerator";
import validateInfo from "../middleware/validateInfo"
import authorise from "../middleware/authorise";

const router = express.Router();

interface User {
    id: string;
    user_email: string;
    user_password: string;
}


//Register
router.post("/register", validateInfo, async (req: Request, res: Response) => {

    const { name, email, password } = req.body;

    try {
        
        const user = await pool.query("SELECT * FROM users WHERE user_email = $1", [email]);

        //Check if user already exists
        if (user.rows.length > 0) {
            return res.status(409).send("User already exists");
        }

        //Bcrypt user password
        const salt = await bcrypt.genSalt(10);
        const bcryptPassword = await bcrypt.hash(password, salt);

        //Add new user to database
        let newUser = await pool.query("INSERT INTO users (user_name, user_email, user_password) VALUES ($1, $2, $3) RETURNING *", [name, email, bcryptPassword]);

        const jwtToken = jwtGenerator(newUser.rows[0].id);
        return res.json({ jwtToken });

    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error(error.message);
        } else {
            console.error("An unknown error occurred");
        }
        res.status(500).send("Server Error");
    }

});
router.post("/login", validateInfo, async (req: Request, res: Response) => {
    const { email, password } = req.body as { email: string; password: string };

    try {
        
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
        const jwtToken = jwtGenerator(user.rows[0].id);
        return res.json({ jwtToken });

    } catch (error) {
        console.error((error as Error).message);
        res.status(500).send("Server Error");
    }
});

router.post("/verify", authorise, async (req: Request, res: Response) => {
    try {
        res.json(true);
        console.error("User verified");
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error(error.message);
        } else {
            console.error('An unknown error occurred');
        }
        res.status(500).send("Server Error");
    }
});

export default router;