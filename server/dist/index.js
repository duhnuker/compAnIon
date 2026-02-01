var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
if (typeof global.gc === 'function') {
    setInterval(() => {
        if (global.gc) {
            global.gc();
        }
    }, 30000);
}
app.use(cors({
    origin: [
        'https://companion-umber.vercel.app',
        'https://companion-production-fbf6.up.railway.app',
        'http://localhost:5173',
        'http://localhost',
        process.env.CLIENT_URL || ''
    ].filter(Boolean),
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
}));
app.use(express.json());
const PORT = process.env.PORT || 5000;
export const pool = new Pool({
    ssl: process.env.SUPABASE_DB_HOST === 'localhost' ? undefined : {
        rejectUnauthorized: false
    },
    user: String(process.env.SUPABASE_DB_USER),
    host: String(process.env.SUPABASE_DB_HOST),
    database: String(process.env.SUPABASE_DB_NAME),
    password: String(process.env.SUPABASE_PASSWORD),
    port: 5432,
});
console.log(`Attempting to connect to database at ${process.env.SUPABASE_DB_HOST} as ${process.env.SUPABASE_DB_USER}`);
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Database connection error:', err);
    }
    else {
        console.log('Database connected successfully');
    }
});
app.use("/auth", jwtAuth);
app.use("/dashboard", dashboard);
app.use("/dashboard/journalentries", journalEntries);
app.use("/dashboard/yourprogress", yourProgress);
app.use("/dashboard/resources", resources);
app.get('/health', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield pool.query('SELECT NOW()');
        res.status(200).send('OK');
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Error');
    }
}));
app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});
