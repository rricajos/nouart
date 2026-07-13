import { fail, redirect } from '@sveltejs/kit';
import { saveEvent } from '$lib/server/admin';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ request }) => {
		const form = await request.formData();
		try {
			await saveEvent(form, null);
		} catch (e) {
			return fail(400, { error: e instanceof Error ? e.message : 'No se pudo guardar.' });
		}
		throw redirect(303, '/admin/events');
	}
};
