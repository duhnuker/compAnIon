CREATE DATABASE compAnIon

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
  user_id UUID DEFAULT uuid_generate_v4(),
  user_name VARCHAR(255) NOT NULL,
  user_email VARCHAR(255) NOT NULL UNIQUE,
  user_password VARCHAR(255) NOT NULL,
  user_created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  user_updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id)
);

CREATE TABLE journalentries (
  journalentry_id UUID DEFAULT uuid_generate_v4(),
  user_id UUID,
  journalentry_text TEXT NOT NULL,
  journalentry_mood VARCHAR(50),
  journalentry_mood_score NUMERIC(6,3),
  journalentry_created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (journalentry_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE moodlogs (
  moodlog_id UUID DEFAULT uuid_generate_v4(),
  user_id UUID,
  moodlog_mood VARCHAR(50) NOT NULL,
  moodlog_created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (moodlog_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE insights (
  insight_id UUID DEFAULT uuid_generate_v4(),
  user_id UUID,
  insight_text TEXT NOT NULL,
  insight_created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (insight_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- INSERT INTO users (name, email, password) VALUES ('Dinuka', 'dinuka@gmail.com', 'dinuka123');
