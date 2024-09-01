import express, { Request, Response } from "express";
import { pool } from "../index";
import bcrypt from "bcrypt";
import jwtGenerator from "../utils/jwtGenerator.js";
import validateInfo from "../middleware/validateInfo.js"

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

router.post("/login", async (req: Request, res: Response) => {});

router.post("/verify", async (req: Request, res: Response) => {});