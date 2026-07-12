import { error, fail, redirect } from '@sveltejs/kit';
import { db, type Artist } from '$lib/server/db';
import { saveArtist, deleteArtist } from '$lib/server/admin';
import type { Actions, PageServerLoad } from './$types';

function getArtist(id: number): Artist {
	const a = db.prepare(`SELECT * FROM artists WHERE id = ?`).get(id) as Artist | undefined;
	if (!a) throw error(404, 'Artista no encontrado');
	return a;
}

export const load: PageServerLoad = ({ params }) => {
	return { artist: getArtist(Number(params.id)) };
};

export const actions: Actions = {
	default: async ({ params, request }) => {
		const artist = getArtist(Number(params.id));
		try {
			await saveArtist(await request.formData(), artist);
		} catch (e) {
			return fail(400, { error: (e as Error).message });
		}
		throw redirect(303, '/admin/artists');
	},
	delete: async ({ params }) => {
		await deleteArtist(Number(params.id));
		throw redirect(303, '/admin/artists');
	}
};
