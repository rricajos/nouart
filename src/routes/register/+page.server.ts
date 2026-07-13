import { fail, redirect } from '@sveltejs/kit';
import {
	getUserByEmail,
	createUser,
	createSession,
	createToken,
	USER_COOKIE,
	USER_COOKIE_OPTS
} from '$lib/server/users';
import { sendVerifyEmail } from '$lib/server/notify';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = ({ locals }) => {
	if (locals.user) throw redirect(303, '/account');
};

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export const actions: Actions = {
	default: async ({ request, cookies, url }) => {
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
		// Verificación de email (best-effort; si no hay RESEND, cae al outbox).
		await sendVerifyEmail(url.origin, user.email, user.name, createToken(user.id, 'verify'));
		throw redirect(303, '/account');
	}
};
