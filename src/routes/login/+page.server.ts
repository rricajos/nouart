import { fail, redirect } from '@sveltejs/kit';
import {
	getUserByEmail,
	verifyPassword,
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

function safeNext(next: string | null): string {
	return next && next.startsWith('/') && !next.startsWith('//') ? next : '/account';
}

export const actions: Actions = {
	// Paso 1: el usuario escribe su email → detectamos si ya tiene cuenta.
	check: async ({ request }) => {
		const email = String((await request.formData()).get('email') ?? '')
			.trim()
			.toLowerCase();
		if (!EMAIL_RE.test(email))
			return fail(400, { step: 'email', email, error: 'Introduce un email válido.' });
		return { step: getUserByEmail(email) ? 'login' : 'register', email };
	},

	// Paso 2a: ya existe → pide contraseña.
	login: async ({ request, cookies, url }) => {
		const form = await request.formData();
		const email = String(form.get('email') ?? '')
			.trim()
			.toLowerCase();
		const password = String(form.get('password') ?? '');
		const user = getUserByEmail(email);
		if (!user || !verifyPassword(password, user.password)) {
			return fail(401, { step: 'login', email, error: 'La contraseña no es correcta.' });
		}
		cookies.set(USER_COOKIE, createSession(user.id), USER_COOKIE_OPTS);
		throw redirect(303, safeNext(url.searchParams.get('next')));
	},

	// Paso 2b: no existe → pide el resto y crea la cuenta.
	register: async ({ request, cookies, url }) => {
		const form = await request.formData();
		const name = String(form.get('name') ?? '').trim();
		const email = String(form.get('email') ?? '')
			.trim()
			.toLowerCase();
		const password = String(form.get('password') ?? '');
		const role = form.get('role') === 'artist' ? 'artist' : 'member';
		const base = { step: 'register', email, name, role };
		if (!EMAIL_RE.test(email)) return fail(400, { ...base, error: 'El email no es válido.' });
		if (name.length < 2) return fail(400, { ...base, error: 'Escribe tu nombre.' });
		if (password.length < 8)
			return fail(400, { ...base, error: 'La contraseña debe tener al menos 8 caracteres.' });
		if (!form.get('terms'))
			return fail(400, { ...base, error: 'Debes aceptar los términos y condiciones para crear la cuenta.' });
		if (role === 'artist' && !form.get('artist_terms'))
			return fail(400, { ...base, error: 'Como artista, debes aceptar la declaración de autoría.' });
		if (getUserByEmail(email))
			return fail(409, {
				step: 'login',
				email,
				error: 'Ya existe una cuenta con ese email. Escribe tu contraseña para entrar.'
			});

		const user = createUser({ name, email, password, role });
		cookies.set(USER_COOKIE, createSession(user.id), USER_COOKIE_OPTS);
		await sendVerifyEmail(url.origin, user.email, user.name, createToken(user.id, 'verify'));
		throw redirect(303, safeNext(url.searchParams.get('next')));
	}
};
