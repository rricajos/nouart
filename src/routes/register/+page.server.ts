import { fail, redirect } from '@sveltejs/kit';
import {
	getUserByEmail,
	createUser,
	createSession,
	USER_COOKIE,
	USER_COOKIE_OPTS
} from '$lib/server/users';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = ({ locals }) => {
	if (locals.user) throw redirect(303, '/account');
};

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const form = await request.formData();
		const name = String(form.get('name') ?? '').trim();
		const email = String(form.get('email') ?? '').trim();
		const password = String(form.get('password') ?? '');
		const role = form.get('role') === 'artist' ? 'artist' : 'member';
		const values = { name, email, role };

		if (name.length < 2) return fail(400, { error: 'Escribe tu nombre.', ...values });
		if (!EMAIL_RE.test(email)) return fail(400, { error: 'Introduce un email válido.', ...values });
		if (password.length < 8)
			return fail(400, { error: 'La contraseña debe tener al menos 8 caracteres.', ...values });
		if (getUserByEmail(email))
			return fail(409, { error: 'Ya existe una cuenta con ese email.', ...values });

		const user = createUser({ name, email, password, role });
		cookies.set(USER_COOKIE, createSession(user.id), USER_COOKIE_OPTS);
		throw redirect(303, '/account');
	}
};
