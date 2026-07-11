import { fail } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { deleteArtwork } from '$lib/server/admin';
import type { Actions, PageServerLoad } from './$types';

interface ArtworkRow {
	id: number;
	slug: string;
	title: string;
	year: string;
	image: string | null;
	published: number;
	artist_name: string;
	likes: number;
}

export const load: PageServerLoad = () => {
	return {
		artworks: db
			.prepare(
				`SELECT w.id, w.slug, w.title, w.year, w.image, w.published, a.name AS artist_name,
				 (SELECT COUNT(*) FROM likes l WHERE l.artwork_id = w.id) AS likes
				 FROM artworks w JOIN artists a ON a.id = w.artist_id
				 ORDER BY w.sort, w.created_at DESC`
			)
			.all() as ArtworkRow[]
	};
};

export const actions: Actions = {
	delete: async ({ request }) => {
		const id = Number((await request.formData()).get('id'));
		if (!id) return fail(400);
		await deleteArtwork(id);
		return { deleted: true };
	},
	togglePublish: async ({ request }) => {
		const id = Number((await request.formData()).get('id'));
		if (!id) return fail(400);
		db.prepare(`UPDATE artworks SET published = 1 - published WHERE id = ?`).run(id);
		return { toggled: true };
	}
};
