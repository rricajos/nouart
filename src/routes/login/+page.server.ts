import { fail, redirect } from '@sveltejs/kit';
import {
	getUserByEmail,
	verifyPassword,
	createSession,
	USER_COOKIE,
	USER_COOKIE_OPTS
} from '$lib/server/users';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = ({ locals }) => {
	if (locals.user) throw redirect(303, '/account');
};

function safeNext(next: string | null): string {
	return next && next.startsWith('/') && !next.startsWith('//') ? next : '/account';
}

export const actions: Actions = {
	default: async ({ request, cookies, url }) => {
		const form = await request.formData();
		const email = String(form.get('email') ?? '').trim();
		const password = String(form.get('password') ?? '');
		const user = getUserByEmail(email);
		if (!user || !verifyPassword(password, user.password)) {
			return fail(401, { error: 'Email o contraseña incorrectos.', email });
		}
		cookies.set(USER_COOKIE, createSession(user.id), USER_COOKIE_OPTS);
		throw redirect(303, safeNext(url.searchParams.get('next')));
	}
};
