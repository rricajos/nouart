import { error } from '@sveltejs/kit';
import { getEventBySlug } from '$lib/server/queries';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ params, locals }) => {
	const event = getEventBySlug(params.slug);
	if (!event || (!event.published && !locals.admin)) throw error(404, 'Actividad no encontrada');
	return { event };
};
