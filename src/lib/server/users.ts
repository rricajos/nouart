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
	email_verified: boolean;
}

export type TokenKind = 'verify' | 'reset';

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
			`SELECT s.expires_at, u.id, u.name, u.email, u.role, u.artist_id, u.approved, u.email_verified
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
				email_verified: number;
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
		approved: !!row.approved,
		email_verified: !!row.email_verified
	};
}

export function destroySession(token: string | undefined): void {
	if (token) db.prepare(`DELETE FROM sessions WHERE token = ?`).run(token);
}

// --- Tokens de un solo uso (verificación de email / reset de contraseña) ---
const TOKEN_AGE: Record<TokenKind, number> = {
	verify: 60 * 60 * 24 * 7, // 7 días
	reset: 60 * 60 // 1 hora
};

/** Crea un token de un solo uso. Para 'reset' invalida los previos del usuario. */
export function createToken(userId: number, kind: TokenKind): string {
	if (kind === 'reset')
		db.prepare(`DELETE FROM user_tokens WHERE user_id = ? AND kind = 'reset'`).run(userId);
	const token = randomBytes(32).toString('hex');
	db.prepare(`INSERT INTO user_tokens (token, user_id, kind, expires_at) VALUES (?, ?, ?, ?)`).run(
		token,
		userId,
		kind,
		now() + TOKEN_AGE[kind]
	);
	return token;
}

/** Devuelve el user_id de un token válido SIN consumirlo (para pintar el formulario). */
export function peekToken(token: string, kind: TokenKind): number | null {
	const row = db
		.prepare(`SELECT user_id, expires_at FROM user_tokens WHERE token = ? AND kind = ?`)
		.get(token, kind) as { user_id: number; expires_at: number } | undefined;
	if (!row || row.expires_at < now()) return null;
	return row.user_id;
}

/** Valida y CONSUME (borra) un token. Devuelve el user_id o null. */
export function consumeToken(token: string, kind: TokenKind): number | null {
	const userId = peekToken(token, kind);
	db.prepare(`DELETE FROM user_tokens WHERE token = ?`).run(token);
	return userId;
}

export function setEmailVerified(userId: number): void {
	db.prepare(`UPDATE users SET email_verified = 1 WHERE id = ?`).run(userId);
}

export function setPassword(userId: number, password: string): void {
	db.prepare(`UPDATE users SET password = ? WHERE id = ?`).run(hashPassword(password), userId);
	// Cierra el resto de sesiones al cambiar la contraseña.
	db.prepare(`DELETE FROM sessions WHERE user_id = ?`).run(userId);
}
