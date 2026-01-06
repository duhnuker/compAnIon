# System Design Layout

This document details the system architecture for the "compAnIon" application.

## 1. High-Level Architecture
The application follows a standard Client-Server architecture with a segregated frontend and backend.

```mermaid
graph TD
    User[User] --> Client["Client (React + Vite)"]
    Client <-->|"API Requests (JSON + Bearer Token)"| Server["Server (Node.js + Express)"]
    
    subgraph "Backend Services"
        Server <-->|"Auth/Data Queries"| DB[("Supabase PostgreSQL")]
        Server <-->|"Local Inference (Sentiment + GenAI)"| AI["AI Engine (Transformers.js)"]
    end
    
    subgraph External
        Server <-.->|"Search (Videos)"| YT["YouTube Data API"]
    end
```

## 2. Technology Stack

### Frontend (Client)
- **Framework**: React (v18) with Vite for build tooling.
- **Language**: TypeScript.
- **Styling**: TailwindCSS for utility-first styling.
- **Visuals**: Three.js (via `three` package) for 3D elements (e.g., LightPillar), Chart.js for data visualization.
- **State/Routing**: React Router DOM (v6).
- **HTTP Client**: Axios.

### Backend (Server)
- **Runtime**: Node.js.
- **Framework**: Express.js.
- **Language**: TypeScript.
- **Database Connector**: `pg` (node-postgres).
- **AI/ML**: `@xenova/transformers` (running locally/in-process) for sentiment analysis.

### Database
- **Provider**: Supabase.
- **Type**: PostgreSQL relational database.
- **Key Tables**:
    - `users`: Stores user credentials and profile data.
    - `journalentries`: Stores user journals + sentiment analysis results.

## 3. Core Components & Responsibilities

### Authentication System
- **Custom Implementation**: Uses `bcrypt` for secure password hashing and `jsonwebtoken` for stateless session management.
- **Components**:
    - `bcrypt`: Hashes passwords before storing in Supabase.
    - `jwtGenerator`: Issues signed tokens upon successful login/registration.
- Endpoints: `/auth/register`, `/auth/login`, `/auth/verify`.
- Middleware: `jwtAuth` protects private routes.

### Dashboard & Journaling
- **Journal Entry Creation**:
    1. User submits text via Client.
    2. Server receives text.
    3. Server runs `analyseSentiment(text)` locally using Transformers.js.
    4. Sentiment Label (e.g., "POSITIVE") and Score are saved to DB along with text.
- **Progress Tracking**: Fetches historical mood scores to visualize user well-being over time.

### Resource Recommendations
- **YouTube Integration**:
    1. User requests resources.
    2. Server generates a search query using a local `distilgpt2` model.
    3. Server calls YouTube Data API to find relevant educational videos.
    4. Returns video ID to client for embedding.

### AI Engine (Local)
- Unlike traditional setups calling external OpenAI APIs, this project runs a quantized sentiment analysis model *inside* the Node.js process using `@xenova/transformers`.
- **Benefit**: Zero latency overhead for network calls to AI providers; privacy-preserving (data stays on server).

## 4. Data Flow Example: Creating a Journal Entry

1. **Client**: User types "I felt great today!" and clicks Submit.
2. **Client**: Sends `POST /dashboard/journalentry` with Bearer Token.
3. **Server (Middleware)**: Verifies JWT. If valid, attaches `user.id` to request.
4. **Server (Controller)**:
    - Calls `analyseSentiment("I felt great today!")`.
    - AI Engine returns `{ label: 'POSITIVE', score: 0.99 }`.
5. **Server (DB)**: Executes SQL `INSERT INTO journalentries ...`.
6. **Database**: Stores row, generates UUID, returns new entry.
7. **Server**: Responds to Client with created entry.
8. **Client**: Updates UI to show new entry in the list.
