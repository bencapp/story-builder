
-- USER is a reserved keyword with Postgres
-- You must use double quotes in every query that user is in:
-- ex. SELECT * FROM "user";
-- Otherwise you will have errors!

CREATE TABLE "user" (
    "id" SERIAL PRIMARY KEY,
    "username" VARCHAR (80) UNIQUE NOT NULL,
    "password" VARCHAR (1000) NOT NULL
);

CREATE TABLE "invite" (
    "id" SERIAL PRIMARY KEY,
    "sender_user_id" INT REFERENCES "user" ON DELETE CASCADE,
    "recipient_user_id" INT REFERENCES "user" ON DELETE CASCADE,
    "title" VARCHAR (80),
    "speed_type" VARCHAR(20),
    "text_type" VARCHAR(20)
);

CREATE TABLE "story" (
	"id" SERIAL PRIMARY KEY,
	"title" VARCHAR(80),
	"speed_type" VARCHAR(50),
	"length_type" VARCHAR(50),
	"public" BOOLEAN DEFAULT FALSE,
	"current_user_turn_id" INT,
	"start_time" TIMESTAMP,
);

CREATE TABLE "user_story" (
	"id" SERIAL PRIMARY KEY,
	"user_id" INT REFERENCES "user",
	"story_id" INT REFERENCES "story"
);

CREATE TABLE "user_story_votes" (
	"id" SERIAL PRIMARY KEY,
	"user_id" INT REFERENCES "user",
	"story_id" INT REFERENCES "story",
	"vote" INT DEFAULT 0
);

CREATE TABLE "text" (
	"id" SERIAL PRIMARY KEY,
	"story_id" INT REFERENCES "story",
	"user_id" INT REFERENCES "user",
	"text" VARCHAR(255),
	"timestamp" TIMESTAMP
);