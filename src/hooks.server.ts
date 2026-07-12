import type { Handle } from '@sveltejs/kit';
import { SESSION_COOKIE, verifyToken } from '$lib/server/auth';
import { USER_COOKIE, getSessionUser } from '$lib/server/users';

export const handle: Handle = async ({ event, resolve }) => {
	const token = event.cookies.get(SESSION_COOKIE);
	event.locals.admin = verifyToken(token, Math.floor(Date.now() / 1000));
	event.locals.user = getSessionUser(event.cookies.get(USER_COOKIE));
	return resolve(event);
};
