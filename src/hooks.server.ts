import type { Handle } from '@sveltejs/kit';
import { SESSION_COOKIE, verifyToken } from '$lib/server/auth';

export const handle: Handle = async ({ event, resolve }) => {
	const token = event.cookies.get(SESSION_COOKIE);
	event.locals.admin = verifyToken(token, Math.floor(Date.now() / 1000));
	return resolve(event);
};
