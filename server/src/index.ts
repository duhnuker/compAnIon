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

let lastAccess = Date.now();
app.use((req, res, next) => {
    lastAccess = Date.now();
    next();
});

setInterval(() => {
    const idleTime = Date.now() - lastAccess;
    if (idleTime > 900000) {
        process.exit(0);
    }
}, 60000);

declare global {
    var gc: (() => void) | undefined;
}

declare global {
    var gc: (() => void) | undefined;
}

if (typeof global.gc === 'function') {
    setInterval(() => {
        if (global.gc) {
            global.gc();
        }
    }, 30000);
}

app.use(cors({
    origin: ['https://companion-umber.vercel.app', 'https://companion-production-fbf6.up.railway.app', 'http://localhost:5173'],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
}));
app.use(express.json());

const PORT = process.env.PORT || 5000;

export const pool = new Pool({
    ssl: {
        rejectUnauthorized: false
    },
    user: process.env.SUPABASE_DB_USER,
    host: process.env.SUPABASE_DB_HOST,
    database: process.env.SUPABASE_DB_NAME,
    password: process.env.SUPABASE_PASSWORD,
    port: 5432,
});

pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Database connection error:', err);
    } else {
        console.log('Database connected successfully');
    }
});

app.use("/auth", jwtAuth);
app.use("/dashboard", dashboard);
app.use("/dashboard/journalentries", journalEntries);
app.use("/dashboard/yourprogress", yourProgress);
app.use("/dashboard/resources", resources)

app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});
