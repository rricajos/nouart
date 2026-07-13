import { error, fail, redirect } from '@sveltejs/kit';
import { db, type Event } from '$lib/server/db';
import { saveEvent } from '$lib/server/admin';
import type { Actions, PageServerLoad } from './$types';

function getEvent(id: number): Event {
	const ev = db.prepare(`SELECT * FROM events WHERE id = ?`).get(id) as Event | undefined;
	if (!ev) throw error(404, 'Actividad no encontrada');
	return ev;
}

export const load: PageServerLoad = ({ params }) => {
	return { event: getEvent(Number(params.id)) };
};

export const actions: Actions = {
	default: async ({ request, params }) => {
		const existing = getEvent(Number(params.id));
		const form = await request.formData();
		try {
			await saveEvent(form, existing);
		} catch (e) {
			return fail(400, { error: e instanceof Error ? e.message : 'No se pudo guardar.' });
		}
		throw redirect(303, '/admin/events');
	}
};
