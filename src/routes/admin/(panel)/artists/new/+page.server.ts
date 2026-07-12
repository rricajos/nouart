import { fail, redirect } from '@sveltejs/kit';
import { saveArtist } from '$lib/server/admin';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ request }) => {
		try {
			await saveArtist(await request.formData(), null);
		} catch (e) {
			return fail(400, { error: (e as Error).message });
		}
		throw redirect(303, '/admin/artists');
	}
};
