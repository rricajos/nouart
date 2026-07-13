import { db, type Artist, type Artwork, type Comment, type Event } from './db';

export interface ArtworkWithArtist extends Artwork {
	artist_name: string;
	artist_slug: string;
	likes: number;
}

const artworkCols = `
	aw.*,
	a.name AS artist_name,
	a.slug AS artist_slug,
	(SELECT COUNT(*) FROM likes l WHERE l.artwork_id = aw.id) AS likes
`;

export function listArtists(): Artist[] {
	return db
		.prepare(`SELECT * FROM artists ORDER BY sort, name`)
		.all() as Artist[];
}

export function getArtistBySlug(slug: string): Artist | undefined {
	return db.prepare(`SELECT * FROM artists WHERE slug = ?`).get(slug) as Artist | undefined;
}

export function listPublishedArtworks(): ArtworkWithArtist[] {
	return db
		.prepare(
			`SELECT ${artworkCols} FROM artworks aw
			 JOIN artists a ON a.id = aw.artist_id
			 WHERE aw.published = 1
			 ORDER BY aw.sort, aw.created_at DESC`
		)
		.all() as ArtworkWithArtist[];
}

export function listArtworksByArtist(artistId: number, onlyPublished = true): ArtworkWithArtist[] {
	return db
		.prepare(
			`SELECT ${artworkCols} FROM artworks aw
			 JOIN artists a ON a.id = aw.artist_id
			 WHERE aw.artist_id = ? ${onlyPublished ? 'AND aw.published = 1' : ''}
			 ORDER BY aw.sort, aw.created_at DESC`
		)
		.all(artistId) as ArtworkWithArtist[];
}

export function getArtworkBySlug(slug: string): ArtworkWithArtist | undefined {
	return db
		.prepare(
			`SELECT ${artworkCols} FROM artworks aw
			 JOIN artists a ON a.id = aw.artist_id
			 WHERE aw.slug = ?`
		)
		.get(slug) as ArtworkWithArtist | undefined;
}

export function approvedComments(artworkId: number): Comment[] {
	return db
		.prepare(
			`SELECT * FROM comments WHERE artwork_id = ? AND approved = 1 ORDER BY created_at`
		)
		.all(artworkId) as Comment[];
}

export function likeCount(artworkId: number): number {
	const row = db
		.prepare(`SELECT COUNT(*) AS n FROM likes WHERE artwork_id = ?`)
		.get(artworkId) as { n: number };
	return row.n;
}

export function hasLiked(artworkId: number, visitor: string): boolean {
	return !!db
		.prepare(`SELECT 1 FROM likes WHERE artwork_id = ? AND visitor = ?`)
		.get(artworkId, visitor);
}

// --- Agenda / eventos ---
/** Eventos publicados separados en próximos (fecha >= hoy o sin fecha) y pasados. */
export function listPublishedEvents(): { upcoming: Event[]; past: Event[] } {
	const upcoming = db
		.prepare(
			`SELECT * FROM events WHERE published = 1 AND (date = '' OR date >= date('now'))
			 ORDER BY (date = '') ASC, date ASC`
		)
		.all() as Event[];
	const past = db
		.prepare(
			`SELECT * FROM events WHERE published = 1 AND date != '' AND date < date('now')
			 ORDER BY date DESC`
		)
		.all() as Event[];
	return { upcoming, past };
}

export function getEventBySlug(slug: string): Event | undefined {
	return db.prepare(`SELECT * FROM events WHERE slug = ?`).get(slug) as Event | undefined;
}
