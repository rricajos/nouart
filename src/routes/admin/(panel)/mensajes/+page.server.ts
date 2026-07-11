import { fail } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import type { Actions, PageServerLoad } from './$types';

import type { Message } from '$lib/server/db';

interface MessageRow extends Message {
	artist_name: string | null;
	artist_slug: string | null;
}

export const load: PageServerLoad = () => {
	return {
		messages: db
			.prepare(
				`SELECT m.*, a.name AS artist_name, a.slug AS artist_slug
				 FROM messages m LEFT JOIN artists a ON a.id = m.artist_id
				 ORDER BY m.handled ASC, m.created_at DESC`
			)
			.all() as MessageRow[]
	};
};

export const actions: Actions = {
	toggle: async ({ request }) => {
		const id = Number((await request.formData()).get('id'));
		if (!id) return fail(400);
		db.prepare(`UPDATE messages SET handled = 1 - handled WHERE id = ?`).run(id);
		return { done: true };
	},
	delete: async ({ request }) => {
		const id = Number((await request.formData()).get('id'));
		if (!id) return fail(400);
		db.prepare(`DELETE FROM messages WHERE id = ?`).run(id);
		return { done: true };
	}
};
