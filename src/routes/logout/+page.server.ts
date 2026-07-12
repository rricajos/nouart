import { redirect } from '@sveltejs/kit';
import { USER_COOKIE, destroySession } from '$lib/server/users';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = () => {
	throw redirect(303, '/');
};

export const actions: Actions = {
	default: async ({ cookies }) => {
		destroySession(cookies.get(USER_COOKIE));
		cookies.delete(USER_COOKIE, { path: '/' });
		throw redirect(303, '/');
	}
};
