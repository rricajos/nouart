import { fail } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { getUserById } from '$lib/server/users';
import { uniqueSlug } from '$lib/server/util';
import type { Actions, PageServerLoad } from './$types';

interface UserRow {
	id: number;
	name: string;
	email: string;
	role: string;
	approved: number;
	artist_id: number | null;
	artist_slug: string | null;
	created_at: string;
}

export const load: PageServerLoad = () => {
	const users = db
		.prepare(
			`SELECT u.id, u.name, u.email, u.role, u.approved, u.artist_id, a.slug AS artist_slug, u.created_at
			 FROM users u LEFT JOIN artists a ON a.id = u.artist_id
			 ORDER BY (u.role = 'artist' AND u.approved = 0) DESC, u.created_at DESC`
		)
		.all() as UserRow[];
	return { users };
};

const slugExists = (slug: string) =>
	!!db.prepare(`SELECT 1 FROM artists WHERE slug = ?`).get(slug);

export const actions: Actions = {
	approve: async ({ request }) => {
		const form = await request.formData();
		const id = Number(form.get('id'));
		const u = getUserById(id);
		if (!u || u.role !== 'artist') return fail(400, { error: 'Usuario no válido.' });
		let artistId = u.artist_id;
		if (!artistId) {
			// Crea el perfil de artista enlazado (oculto hasta que tenga obra/lo edite).
			const slug = uniqueSlug(u.name, slugExists, 'artist');
			const info = db
				.prepare(`INSERT INTO artists (slug, name, email) VALUES (?, ?, ?)`)
				.run(slug, u.name, u.email);
			artistId = Number(info.lastInsertRowid);
		}
		db.prepare(`UPDATE users SET approved = 1, artist_id = ? WHERE id = ?`).run(artistId, id);
		return { ok: true };
	},

	revoke: async ({ request }) => {
		const id = Number((await request.formData()).get('id'));
		db.prepare(`UPDATE users SET approved = 0 WHERE id = ? AND role = 'artist'`).run(id);
		return { ok: true };
	},

	remove: async ({ request }) => {
		const id = Number((await request.formData()).get('id'));
		db.prepare(`DELETE FROM users WHERE id = ?`).run(id);
		return { ok: true };
	}
};
