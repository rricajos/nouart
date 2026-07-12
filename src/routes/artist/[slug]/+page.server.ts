import { error } from '@sveltejs/kit';
import { getArtistBySlug, listArtworksByArtist } from '$lib/server/queries';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ params }) => {
	const artist = getArtistBySlug(params.slug);
	if (!artist) throw error(404, 'Artista no encontrado');
	return { artist, artworks: listArtworksByArtist(artist.id) };
};
