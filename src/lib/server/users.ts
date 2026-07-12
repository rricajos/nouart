import { scryptSync, randomBytes, timingSafeEqual } from 'node:crypto';
import { db, type Role, type User } from './db';

export const USER_COOKIE = 'nouart_session';
const SESSION_AGE = 60 * 60 * 24 * 30; // 30 días

export const USER_COOKIE_OPTS = {
	path: '/',
	httpOnly: true,
	sameSite: 'lax' as const,
	secure: process.env.NODE_ENV === 'production',
	maxAge: SESSION_AGE
};

/** Datos del usuario que viajan en `locals.user` (sin el hash). */
export interface SessionUser {
	id: number;
	name: string;
	email: string;
	role: Role;
	artist_id: number | null;
	approved: boolean;
}

// --- Contraseñas (scrypt nativo, sin dependencias) ---
export function hashPassword(pw: string): string {
	const salt = randomBytes(16).toString('hex');
	const hash = scryptSync(pw, salt, 64).toString('hex');
	return `${salt}:${hash}`;
}

export function verifyPassword(pw: string, stored: string): boolean {
	const [salt, hash] = stored.split(':');
	if (!salt || !hash) return false;
	const hashBuf = Buffer.from(hash, 'hex');
	const test = scryptSync(pw, salt, 64);
	return hashBuf.length === test.length && timingSafeEqual(hashBuf, test);
}

// --- Usuarios ---
export function getUserByEmail(email: string): User | undefined {
	return db.prepare(`SELECT * FROM users WHERE email = ?`).get(email.toLowerCase()) as
		| User
		| undefined;
}

export function getUserById(id: number): User | undefined {
	return db.prepare(`SELECT * FROM users WHERE id = ?`).get(id) as User | undefined;
}

export function createUser(opts: {
	name: string;
	email: string;
	password: string;
	role: Role;
}): User {
	const approved = opts.role === 'artist' ? 0 : 1; // los artistas requieren aprobación
	const info = db
		.prepare(
			`INSERT INTO users (name, email, password, role, approved) VALUES (?, ?, ?, ?, ?)`
		)
		.run(opts.name, opts.email.toLowerCase(), hashPassword(opts.password), opts.role, approved);
	return getUserById(Number(info.lastInsertRowid)) as User;
}

// --- Sesiones (tabla, permite revocar/cerrar sesión) ---
function now(): number {
	return Math.floor(Date.now() / 1000);
}

export function createSession(userId: number): string {
	const token = randomBytes(32).toString('hex');
	db.prepare(`INSERT INTO sessions (token, user_id, expires_at) VALUES (?, ?, ?)`).run(
		token,
		userId,
		now() + SESSION_AGE
	);
	return token;
}

export function getSessionUser(token: string | undefined): SessionUser | null {
	if (!token) return null;
	const row = db
		.prepare(
			`SELECT s.expires_at, u.id, u.name, u.email, u.role, u.artist_id, u.approved
			 FROM sessions s JOIN users u ON u.id = s.user_id
			 WHERE s.token = ?`
		)
		.get(token) as
		| {
				expires_at: number;
				id: number;
				name: string;
				email: string;
				role: Role;
				artist_id: number | null;
				approved: number;
		  }
		| undefined;
	if (!row) return null;
	if (row.expires_at < now()) {
		db.prepare(`DELETE FROM sessions WHERE token = ?`).run(token);
		return null;
	}
	return {
		id: row.id,
		name: row.name,
		email: row.email,
		role: row.role,
		artist_id: row.artist_id,
		approved: !!row.approved
	};
}

export function destroySession(token: string | undefined): void {
	if (token) db.prepare(`DELETE FROM sessions WHERE token = ?`).run(token);
}
