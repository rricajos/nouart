import { listPublishedArtworks, listArtists } from '$lib/server/queries';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ url }) => {
	const artistFilter = url.searchParams.get('artista') ?? '';
	let artworks = listPublishedArtworks();
	if (artistFilter) artworks = artworks.filter((a) => a.artist_slug === artistFilter);
	return { artworks, artists: listArtists(), artistFilter };
};
