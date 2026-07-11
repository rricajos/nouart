import { createHmac, timingSafeEqual } from 'node:crypto';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? 'nouart';
const SESSION_SECRET = process.env.SESSION_SECRET ?? 'dev-insecure-secret-change-me';
export const SESSION_COOKIE = 'nouart_admin';
const MAX_AGE = 60 * 60 * 24 * 14; // 14 days

function sign(value: string): string {
	return createHmac('sha256', SESSION_SECRET).update(value).digest('hex');
}

function safeEqual(a: string, b: string): boolean {
	const ab = Buffer.from(a);
	const bb = Buffer.from(b);
	if (ab.length !== bb.length) return false;
	return timingSafeEqual(ab, bb);
}

export function checkPassword(password: string): boolean {
	return safeEqual(password, ADMIN_PASSWORD);
}

/** Issue a signed session token that expires MAX_AGE seconds from `now`. */
export function issueToken(now: number): string {
	const exp = now + MAX_AGE;
	return `${exp}.${sign(String(exp))}`;
}

export function verifyToken(token: string | undefined, now: number): boolean {
	if (!token) return false;
	const [expStr, mac] = token.split('.');
	if (!expStr || !mac) return false;
	if (!safeEqual(mac, sign(expStr))) return false;
	return Number(expStr) > now;
}

export const COOKIE_OPTS = {
	path: '/',
	httpOnly: true,
	sameSite: 'lax' as const,
	secure: process.env.NODE_ENV === 'production',
	maxAge: MAX_AGE
};
