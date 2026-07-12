import { fail, redirect } from '@sveltejs/kit';
import { listArtists } from '$lib/server/queries';
import { saveArtwork } from '$lib/server/admin';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = () => {
	return { artists: listArtists() };
};

export const actions: Actions = {
	default: async ({ request }) => {
		try {
			await saveArtwork(await request.formData(), null);
		} catch (e) {
			return fail(400, { error: (e as Error).message });
		}
		throw redirect(303, '/admin/works');
	}
};
