import { fail } from '@sveltejs/kit';
import { db, type Event } from '$lib/server/db';
import { deleteEvent } from '$lib/server/admin';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = () => {
	return {
		events: db.prepare(`SELECT * FROM events ORDER BY (date = '') ASC, date DESC`).all() as Event[]
	};
};

export const actions: Actions = {
	delete: async ({ request }) => {
		const id = Number((await request.formData()).get('id'));
		if (!id) return fail(400);
		await deleteEvent(id);
		return { deleted: true };
	},
	togglePublish: async ({ request }) => {
		const id = Number((await request.formData()).get('id'));
		if (!id) return fail(400);
		db.prepare(`UPDATE events SET published = 1 - published WHERE id = ?`).run(id);
		return { toggled: true };
	}
};
