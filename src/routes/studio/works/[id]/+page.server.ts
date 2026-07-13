import { error, fail, redirect } from '@sveltejs/kit';
import { db, type Artwork } from '$lib/server/db';
import { saveArtwork, deleteArtwork } from '$lib/server/admin';
import type { Actions, PageServerLoad } from './$types';

/** Verifica sesión de artista aprobado y que la obra sea SUYA. Devuelve la obra. */
function ownWork(locals: App.Locals, id: number): Artwork {
	if (!locals.user) throw redirect(303, '/login?next=/studio');
	if (locals.user.role !== 'artist' || !locals.user.approved || !locals.user.artist_id)
		throw redirect(303, '/studio');
	const aw = db.prepare(`SELECT * FROM artworks WHERE id = ?`).get(id) as Artwork | undefined;
	if (!aw) throw error(404, 'Obra no encontrada');
	if (aw.artist_id !== locals.user.artist_id) throw error(403, 'Esta obra no es tuya');
	return aw;
}

export const load: PageServerLoad = ({ locals, params }) => {
	return { artwork: ownWork(locals, Number(params.id)) };
};

export const actions: Actions = {
	save: async ({ request, locals, params }) => {
		const existing = ownWork(locals, Number(params.id));
		const form = await request.formData();
		form.set('artist_id', String(existing.artist_id)); // mantiene su artista
		try {
			await saveArtwork(form, existing);
		} catch (e) {
			return fail(400, { error: e instanceof Error ? e.message : 'No se pudo guardar.' });
		}
		throw redirect(303, '/studio');
	},

	delete: async ({ locals, params }) => {
		ownWork(locals, Number(params.id));
		await deleteArtwork(Number(params.id));
		throw redirect(303, '/studio');
	}
};
