import { fail, redirect } from '@sveltejs/kit';
import { saveArtwork } from '$lib/server/admin';
import type { Actions, PageServerLoad } from './$types';

function requireApprovedArtist(locals: App.Locals): number {
	if (!locals.user) throw redirect(303, '/login?next=/studio');
	if (locals.user.role !== 'artist') throw redirect(303, '/account');
	if (!locals.user.approved || !locals.user.artist_id) throw redirect(303, '/studio');
	return locals.user.artist_id;
}

export const load: PageServerLoad = ({ locals }) => {
	requireApprovedArtist(locals);
	return {};
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const artistId = requireApprovedArtist(locals);
		const form = await request.formData();
		form.set('artist_id', String(artistId)); // fuerza SU artista (no puede asignar a otro)
		try {
			await saveArtwork(form, null);
		} catch (e) {
			return fail(400, { error: e instanceof Error ? e.message : 'No se pudo guardar la obra.' });
		}
		throw redirect(303, '/studio');
	}
};
