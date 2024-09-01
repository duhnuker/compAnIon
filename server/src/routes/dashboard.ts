import express, { Request, Response } from "express";
import { pool } from "../src";

const router = express.Router();

router.get("/", async (req:Request, res:Response) => {

});

export default router;