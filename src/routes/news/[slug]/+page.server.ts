import { error } from '@sveltejs/kit';
import { getNewsBySlug } from '$lib/server/queries';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ params, locals }) => {
	const post = getNewsBySlug(params.slug);
	if (!post || (!post.published && !locals.admin)) throw error(404, 'Noticia no encontrada');
	return { post };
};
