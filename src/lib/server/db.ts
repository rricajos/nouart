import Database from 'better-sqlite3';
import { existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

export const DATA_DIR = process.env.DATA_DIR ?? join(process.cwd(), 'data');
export const UPLOADS_DIR = join(DATA_DIR, 'uploads');

if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
if (!existsSync(UPLOADS_DIR)) mkdirSync(UPLOADS_DIR, { recursive: true });

export const db = new Database(join(DATA_DIR, 'nouart.db'));
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
CREATE TABLE IF NOT EXISTS artists (
	id          INTEGER PRIMARY KEY AUTOINCREMENT,
	slug        TEXT NOT NULL UNIQUE,
	name        TEXT NOT NULL,
	discipline  TEXT NOT NULL DEFAULT '',
	bio         TEXT NOT NULL DEFAULT '',
	photo       TEXT,
	website     TEXT,
	instagram   TEXT,
	email       TEXT,
	sort        INTEGER NOT NULL DEFAULT 0,
	created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS artworks (
	id          INTEGER PRIMARY KEY AUTOINCREMENT,
	slug        TEXT NOT NULL UNIQUE,
	artist_id   INTEGER NOT NULL REFERENCES artists(id) ON DELETE CASCADE,
	title       TEXT NOT NULL,
	description TEXT NOT NULL DEFAULT '',
	year        TEXT NOT NULL DEFAULT '',
	medium      TEXT NOT NULL DEFAULT '',
	image       TEXT,
	published   INTEGER NOT NULL DEFAULT 1,
	sort        INTEGER NOT NULL DEFAULT 0,
	created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS comments (
	id          INTEGER PRIMARY KEY AUTOINCREMENT,
	artwork_id  INTEGER NOT NULL REFERENCES artworks(id) ON DELETE CASCADE,
	author      TEXT NOT NULL,
	body        TEXT NOT NULL,
	approved    INTEGER NOT NULL DEFAULT 0,
	created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS likes (
	artwork_id  INTEGER NOT NULL REFERENCES artworks(id) ON DELETE CASCADE,
	visitor     TEXT NOT NULL,
	created_at  TEXT NOT NULL DEFAULT (datetime('now')),
	PRIMARY KEY (artwork_id, visitor)
);

CREATE TABLE IF NOT EXISTS messages (
	id          INTEGER PRIMARY KEY AUTOINCREMENT,
	artist_id   INTEGER REFERENCES artists(id) ON DELETE SET NULL,
	name        TEXT NOT NULL,
	email       TEXT NOT NULL,
	body        TEXT NOT NULL,
	handled     INTEGER NOT NULL DEFAULT 0,
	created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_artworks_artist ON artworks(artist_id);
CREATE INDEX IF NOT EXISTS idx_comments_artwork ON comments(artwork_id);
CREATE INDEX IF NOT EXISTS idx_messages_artist ON messages(artist_id);
`);

export interface Artist {
	id: number;
	slug: string;
	name: string;
	discipline: string;
	bio: string;
	photo: string | null;
	website: string | null;
	instagram: string | null;
	email: string | null;
	sort: number;
	created_at: string;
}

export interface Artwork {
	id: number;
	slug: string;
	artist_id: number;
	title: string;
	description: string;
	year: string;
	medium: string;
	image: string | null;
	published: number;
	sort: number;
	created_at: string;
}

export interface Comment {
	id: number;
	artwork_id: number;
	author: string;
	body: string;
	approved: number;
	created_at: string;
}

export interface Message {
	id: number;
	artist_id: number | null;
	name: string;
	email: string;
	body: string;
	handled: number;
	created_at: string;
}
