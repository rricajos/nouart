import { fail, redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { getUserById, hashPassword, verifyPassword } from '$lib/server/users';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = ({ locals }) => {
	if (!locals.user) throw redirect(303, '/login?next=/account');
	let artistSlug: string | null = null;
	if (locals.user.artist_id) {
		const r = db.prepare(`SELECT slug FROM artists WHERE id = ?`).get(locals.user.artist_id) as
			| { slug: string }
			| undefined;
		artistSlug = r?.slug ?? null;
	}
	return { account: locals.user, artistSlug };
};

export const actions: Actions = {
	profile: async ({ request, locals }) => {
		if (!locals.user) return fail(401);
		const form = await request.formData();
		const name = String(form.get('name') ?? '').trim();
		if (name.length < 2) return fail(400, { pError: 'Escribe tu nombre.' });
		db.prepare(`UPDATE users SET name = ? WHERE id = ?`).run(name, locals.user.id);
		return { pOk: true };
	},

	password: async ({ request, locals }) => {
		if (!locals.user) return fail(401);
		const form = await request.formData();
		const current = String(form.get('current') ?? '');
		const next = String(form.get('next') ?? '');
		const u = getUserById(locals.user.id);
		if (!u || !verifyPassword(current, u.password))
			return fail(400, { pwError: 'La contraseña actual no es correcta.' });
		if (next.length < 8)
			return fail(400, { pwError: 'La nueva contraseña debe tener al menos 8 caracteres.' });
		db.prepare(`UPDATE users SET password = ? WHERE id = ?`).run(hashPassword(next), u.id);
		return { pwOk: true };
	}
};
