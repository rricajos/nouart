import { fail } from '@sveltejs/kit';
import { db, type News } from '$lib/server/db';
import { deleteNews } from '$lib/server/admin';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = () => ({
	news: db
		.prepare(`SELECT * FROM news ORDER BY (date = '') ASC, date DESC, created_at DESC`)
		.all() as News[]
});

export const actions: Actions = {
	delete: async ({ request }) => {
		const id = Number((await request.formData()).get('id'));
		if (!id) return fail(400);
		await deleteNews(id);
		return { deleted: true };
	},
	togglePublish: async ({ request }) => {
		const id = Number((await request.formData()).get('id'));
		if (!id) return fail(400);
		db.prepare(`UPDATE news SET published = 1 - published WHERE id = ?`).run(id);
		return { toggled: true };
	}
};
