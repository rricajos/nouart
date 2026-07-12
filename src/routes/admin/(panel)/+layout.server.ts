import { redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = ({ locals, url }) => {
	if (!locals.admin) throw redirect(303, '/admin/login');
	const pendingComments = (
		db.prepare(`SELECT COUNT(*) AS n FROM comments WHERE approved = 0`).get() as { n: number }
	).n;
	const unreadMessages = (
		db.prepare(`SELECT COUNT(*) AS n FROM messages WHERE handled = 0`).get() as { n: number }
	).n;
	const pendingArtists = (
		db
			.prepare(`SELECT COUNT(*) AS n FROM users WHERE role = 'artist' AND approved = 0`)
			.get() as { n: number }
	).n;
	return { pendingComments, unreadMessages, pendingArtists, pathname: url.pathname };
};
