import { error, fail, redirect } from '@sveltejs/kit';
import { db, type Artwork } from '$lib/server/db';
import { listArtists } from '$lib/server/queries';
import { saveArtwork, deleteArtwork } from '$lib/server/admin';
import type { Actions, PageServerLoad } from './$types';

function getArtwork(id: number): Artwork {
	const w = db.prepare(`SELECT * FROM artworks WHERE id = ?`).get(id) as Artwork | undefined;
	if (!w) throw error(404, 'Obra no encontrada');
	return w;
}

export const load: PageServerLoad = ({ params }) => {
	return { artwork: getArtwork(Number(params.id)), artists: listArtists() };
};

export const actions: Actions = {
	default: async ({ params, request }) => {
		const artwork = getArtwork(Number(params.id));
		try {
			await saveArtwork(await request.formData(), artwork);
		} catch (e) {
			return fail(400, { error: (e as Error).message });
		}
		throw redirect(303, '/admin/obras');
	},
	delete: async ({ params }) => {
		await deleteArtwork(Number(params.id));
		throw redirect(303, '/admin/obras');
	}
};
