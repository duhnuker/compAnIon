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
    origin: 'https://companion-umber.vercel.app',
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
