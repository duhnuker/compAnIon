import express from 'express';
import cors from 'cors';
import pkg from 'pg';
const { Pool } = pkg;
import 'dotenv/config';
import jwtAuth from "./routes/jwtAuth.js";
import dashboard from './routes/dashboard.js';


const app = express();
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());

const PORT = process.env.PORT || 5000;

export const pool = new Pool({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_NAME,
    password: process.env.PG_PASSWORD,
    port: 5432
});


app.use("/auth", jwtAuth);

app.use("/dashboard", dashboard);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
