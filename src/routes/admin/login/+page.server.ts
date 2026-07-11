import { fail, redirect } from '@sveltejs/kit';
import { COOKIE_OPTS, SESSION_COOKIE, checkPassword, issueToken } from '$lib/server/auth';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = ({ locals }) => {
	if (locals.admin) throw redirect(303, '/admin');
};

export const actions: Actions = {
	login: async ({ request, cookies }) => {
		const form = await request.formData();
		const password = String(form.get('password') ?? '');
		if (!checkPassword(password)) {
			return fail(401, { error: 'Contraseña incorrecta.' });
		}
		cookies.set(SESSION_COOKIE, issueToken(Math.floor(Date.now() / 1000)), COOKIE_OPTS);
		throw redirect(303, '/admin');
	},

	logout: async ({ cookies }) => {
		cookies.delete(SESSION_COOKIE, { path: '/' });
		throw redirect(303, '/admin/login');
	}
};
