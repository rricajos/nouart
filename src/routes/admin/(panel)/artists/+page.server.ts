import { fail } from '@sveltejs/kit';
import { db, type Artist } from '$lib/server/db';
import { deleteArtist } from '$lib/server/admin';
import type { Actions, PageServerLoad } from './$types';

interface ArtistRow extends Artist {
	works: number;
}

export const load: PageServerLoad = () => {
	return {
		artists: db
			.prepare(
				`SELECT a.*, (SELECT COUNT(*) FROM artworks w WHERE w.artist_id = a.id) AS works
				 FROM artists a ORDER BY a.sort, a.name`
			)
			.all() as ArtistRow[]
	};
};

export const actions: Actions = {
	delete: async ({ request }) => {
		const id = Number((await request.formData()).get('id'));
		if (!id) return fail(400);
		await deleteArtist(id);
		return { deleted: true };
	}
};
