import { fail } from '@sveltejs/kit';
import { db, type Comment } from '$lib/server/db';
import type { Actions, PageServerLoad } from './$types';

interface CommentRow extends Comment {
	artwork_title: string;
	artwork_slug: string;
}

const withArtwork = `
	SELECT c.*, w.title AS artwork_title, w.slug AS artwork_slug
	FROM comments c JOIN artworks w ON w.id = c.artwork_id
`;

export const load: PageServerLoad = () => {
	return {
		pending: db
			.prepare(`${withArtwork} WHERE c.approved = 0 ORDER BY c.created_at DESC`)
			.all() as CommentRow[],
		approved: db
			.prepare(`${withArtwork} WHERE c.approved = 1 ORDER BY c.created_at DESC LIMIT 50`)
			.all() as CommentRow[]
	};
};

export const actions: Actions = {
	approve: async ({ request }) => {
		const id = Number((await request.formData()).get('id'));
		if (!id) return fail(400);
		db.prepare(`UPDATE comments SET approved = 1 WHERE id = ?`).run(id);
		return { done: true };
	},
	unapprove: async ({ request }) => {
		const id = Number((await request.formData()).get('id'));
		if (!id) return fail(400);
		db.prepare(`UPDATE comments SET approved = 0 WHERE id = ?`).run(id);
		return { done: true };
	},
	delete: async ({ request }) => {
		const id = Number((await request.formData()).get('id'));
		if (!id) return fail(400);
		db.prepare(`DELETE FROM comments WHERE id = ?`).run(id);
		return { done: true };
	}
};
