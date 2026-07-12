import { fail, redirect } from '@sveltejs/kit';
import { db, type Artist, type Artwork } from '$lib/server/db';
import type { SessionUser } from '$lib/server/users';
import type { Actions, PageServerLoad } from './$types';

function requireArtist(locals: App.Locals): SessionUser {
	if (!locals.user) throw redirect(303, '/login?next=/studio');
	if (locals.user.role !== 'artist') throw redirect(303, '/account');
	return locals.user;
}

export const load: PageServerLoad = ({ locals }) => {
	const u = requireArtist(locals);
	const artist = u.artist_id
		? (db.prepare(`SELECT * FROM artists WHERE id = ?`).get(u.artist_id) as Artist | undefined)
		: undefined;
	const artworks = artist
		? (db
				.prepare(`SELECT * FROM artworks WHERE artist_id = ? ORDER BY sort, created_at DESC`)
				.all(artist.id) as Artwork[])
		: [];
	return { artist: artist ?? null, approved: u.approved, artworks };
};

export const actions: Actions = {
	profile: async ({ request, locals }) => {
		const u = requireArtist(locals);
		if (!u.approved || !u.artist_id)
			return fail(403, { error: 'Tu cuenta de artista aún no está aprobada.' });
		const form = await request.formData();
		const name = String(form.get('name') ?? '').trim();
		const discipline = String(form.get('discipline') ?? '').trim();
		const bio = String(form.get('bio') ?? '').trim();
		const website = String(form.get('website') ?? '').trim();
		const instagram = String(form.get('instagram') ?? '').trim();
		const email = String(form.get('email') ?? '').trim();
		if (name.length < 2) return fail(400, { error: 'Escribe tu nombre de artista.' });
		db.prepare(
			`UPDATE artists SET name=?, discipline=?, bio=?, website=?, instagram=?, email=? WHERE id=?`
		).run(name, discipline, bio, website || null, instagram || null, email || null, u.artist_id);
		return { ok: true };
	}
};
