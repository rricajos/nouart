import { fail } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { deleteAttachments } from '$lib/server/uploads';
import type { Actions, PageServerLoad } from './$types';

import type { Message } from '$lib/server/db';

interface MessageRow extends Message {
	artist_name: string | null;
	artist_slug: string | null;
}

export const load: PageServerLoad = ({ url }) => {
	// Filtro por tema (?topic=socio). Vacío = todos.
	const topic = url.searchParams.get('topic') ?? '';
	const where = topic ? `WHERE m.topic = ?` : '';
	const sql = `SELECT m.*, a.name AS artist_name, a.slug AS artist_slug
		 FROM messages m LEFT JOIN artists a ON a.id = m.artist_id
		 ${where}
		 ORDER BY m.handled ASC, m.created_at DESC`;
	const messages = (topic ? db.prepare(sql).all(topic) : db.prepare(sql).all()) as MessageRow[];

	// Recuento por tema para las pestañas del filtro.
	const counts = db
		.prepare(`SELECT COALESCE(topic, 'otro') AS topic, COUNT(*) AS n FROM messages GROUP BY 1`)
		.all() as { topic: string; n: number }[];
	const total = counts.reduce((s, c) => s + c.n, 0);

	return { messages, topic, counts, total };
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
		// Borra también los adjuntos del disco: si no, quedan huérfanos ocupando espacio.
		const row = db.prepare(`SELECT attachments FROM messages WHERE id = ?`).get(id) as
			| { attachments: string | null }
			| undefined;
		db.prepare(`DELETE FROM messages WHERE id = ?`).run(id);
		await deleteAttachments(row?.attachments);
		return { done: true };
	}
};
