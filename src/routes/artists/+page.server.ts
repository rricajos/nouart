import { db } from '$lib/server/db';
import { listArtists } from '$lib/server/queries';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = () => {
	const artists = listArtists();
	const counts = db
		.prepare(
			`SELECT artist_id, COUNT(*) AS n FROM artworks WHERE published = 1 GROUP BY artist_id`
		)
		.all() as { artist_id: number; n: number }[];
	const byId = new Map(counts.map((c) => [c.artist_id, c.n]));
	return { artists: artists.map((a) => ({ ...a, works: byId.get(a.id) ?? 0 })) };
};
