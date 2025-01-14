import express from 'express';
import cors from 'cors';
import pkg from 'pg';
const { Pool } = pkg;
import 'dotenv/config';
import jwtAuth from "./routes/jwtAuth.js";
import dashboard from './routes/dashboard.js';
import journalEntries from './routes/journalEntries.js';
import yourProgress from './routes/yourProgress.js';
import resources from './routes/resources.js';


const app = express();
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());

const PORT = process.env.PORT || 5000;

export const pool = new Pool({
    connectionString: process.env.SUPABASE_DB_URL,
    user: process.env.SUPABASE_DB_USER,
    host: process.env.SUPABASE_DB_HOST,
    database: process.env.SUPABASE_DB_NAME,
    port: 5432
});


app.use("/auth", jwtAuth);
app.use("/dashboard", dashboard);
app.use("/dashboard/journalentries", journalEntries);
app.use("/dashboard/yourprogress", yourProgress);
app.use("/dashboard/resources", resources)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
