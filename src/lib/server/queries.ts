import { db, type Artist, type Artwork, type Comment, type Event, type News } from './db';

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
	// ⚠️ El orden NO se delega a SQLite: compara por bytes, así que 'Óscar' o 'Ñuria'
	// caerían detrás de 'Zoe'. localeCompare('es') los coloca donde toca.
	return (db.prepare(`SELECT * FROM artists`).all() as Artist[]).sort(
		(a, b) => a.sort - b.sort || a.name.localeCompare(b.name, 'es')
	);
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

/** Obras que un usuario/visitante ha marcado como favoritas (por su identidad de like). */
export function listFavorites(likeId: string): ArtworkWithArtist[] {
	return db
		.prepare(
			`SELECT ${artworkCols} FROM artworks aw
			 JOIN artists a ON a.id = aw.artist_id
			 JOIN likes l ON l.artwork_id = aw.id AND l.visitor = ?
			 WHERE aw.published = 1
			 ORDER BY l.created_at DESC`
		)
		.all(likeId) as ArtworkWithArtist[];
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

// --- Mensajes del usuario (seguimiento desde /account) ---
export interface UserMessage {
	id: number;
	body: string;
	handled: number;
	attachments: string | null;
	created_at: string;
}

/**
 * Mensajes de un usuario: los enviados con sesión (user_id) y, SOLO si su email
 * está verificado, también los que mandó antes de registrarse con ese mismo email.
 * ⚠️ La verificación es imprescindible: si no, cualquiera podría registrarse con el
 * email de otra persona y leer sus mensajes.
 *
 * ⚠️ `email` DEBE llegar ya en minúsculas desde JS (users.email lo está). No usamos
 * lower(?) de SQLite porque es solo-ASCII: dejaría 'JOSÉ' → 'josÉ' y no emparejaría.
 */
export function listUserMessages(
	userId: number,
	email: string,
	emailVerified: boolean
): UserMessage[] {
	if (emailVerified) {
		return db
			.prepare(
				`SELECT id, body, handled, attachments, created_at FROM messages
				 WHERE user_id = ? OR (user_id IS NULL AND lower(email) = ?)
				 ORDER BY created_at DESC`
			)
			.all(userId, email) as UserMessage[];
	}
	return db
		.prepare(
			`SELECT id, body, handled, attachments, created_at FROM messages
			 WHERE user_id = ? ORDER BY created_at DESC`
		)
		.all(userId) as UserMessage[];
}

// --- Noticias ---
/** Noticias publicadas, de más reciente a más antigua. */
export function listPublishedNews(limit?: number): News[] {
	const sql = `SELECT * FROM news WHERE published = 1 ORDER BY (date = '') ASC, date DESC, created_at DESC`;
	return (limit ? db.prepare(`${sql} LIMIT ?`).all(limit) : db.prepare(sql).all()) as News[];
}

export function getNewsBySlug(slug: string): News | undefined {
	return db.prepare(`SELECT * FROM news WHERE slug = ?`).get(slug) as News | undefined;
}
