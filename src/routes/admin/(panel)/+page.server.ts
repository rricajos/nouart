import { db, type Message } from '$lib/server/db';
import type { PageServerLoad } from './$types';

interface RecentMessage extends Message {
	artist_name: string | null;
}

const count = (sql: string) => (db.prepare(sql).get() as { n: number }).n;

export const load: PageServerLoad = () => {
	return {
		stats: {
			artists: count(`SELECT COUNT(*) AS n FROM artists`),
			artworks: count(`SELECT COUNT(*) AS n FROM artworks`),
			published: count(`SELECT COUNT(*) AS n FROM artworks WHERE published = 1`),
			likes: count(`SELECT COUNT(*) AS n FROM likes`),
			pendingComments: count(`SELECT COUNT(*) AS n FROM comments WHERE approved = 0`),
			unreadMessages: count(`SELECT COUNT(*) AS n FROM messages WHERE handled = 0`)
		},
		recentMessages: db
			.prepare(
				`SELECT m.*, a.name AS artist_name FROM messages m
				 LEFT JOIN artists a ON a.id = m.artist_id
				 ORDER BY m.created_at DESC LIMIT 5`
			)
			.all() as RecentMessage[]
	};
};
