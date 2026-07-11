import { listPublishedArtworks, listArtists } from '$lib/server/queries';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = () => {
	const artworks = listPublishedArtworks();
	return {
		featured: artworks.slice(0, 8),
		total: artworks.length,
		artists: listArtists()
	};
};
