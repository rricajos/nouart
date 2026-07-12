import { error, fail } from '@sveltejs/kit';
import { randomUUID } from 'node:crypto';
import { db, type Artist } from '$lib/server/db';
import { approvedComments, getArtworkBySlug, hasLiked, likeCount } from '$lib/server/queries';
import { sendMail } from '$lib/server/email';
import type { Actions, PageServerLoad } from './$types';

const VISITOR_COOKIE = 'nouart_v';

function visitorId(cookies: import('@sveltejs/kit').Cookies): string {
	let id = cookies.get(VISITOR_COOKIE);
	if (!id) {
		id = randomUUID();
		cookies.set(VISITOR_COOKIE, id, {
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			maxAge: 60 * 60 * 24 * 365
		});
	}
	return id;
}

export const load: PageServerLoad = ({ params, cookies }) => {
	const artwork = getArtworkBySlug(params.slug);
	if (!artwork || (!artwork.published && !cookies.get('nouart_admin'))) {
		throw error(404, 'Obra no encontrada');
	}
	const visitor = visitorId(cookies);
	const artist = db
		.prepare(`SELECT * FROM artists WHERE id = ?`)
		.get(artwork.artist_id) as Artist;
	return {
		artwork,
		artist,
		comments: approvedComments(artwork.id),
		likes: likeCount(artwork.id),
		liked: hasLiked(artwork.id, visitor)
	};
};

export const actions: Actions = {
	like: async ({ params, cookies }) => {
		const artwork = getArtworkBySlug(params.slug);
		if (!artwork) return fail(404);
		const visitor = visitorId(cookies);
		if (hasLiked(artwork.id, visitor)) {
			db.prepare(`DELETE FROM likes WHERE artwork_id = ? AND visitor = ?`).run(artwork.id, visitor);
			return { liked: false, likes: likeCount(artwork.id) };
		}
		db.prepare(`INSERT OR IGNORE INTO likes (artwork_id, visitor) VALUES (?, ?)`).run(
			artwork.id,
			visitor
		);
		return { liked: true, likes: likeCount(artwork.id) };
	},

	comment: async ({ params, request }) => {
		const artwork = getArtworkBySlug(params.slug);
		if (!artwork) return fail(404);
		const form = await request.formData();
		// Honeypot: bots fill hidden fields.
		if (form.get('website')) return { commented: true };
		const author = String(form.get('author') ?? '').trim();
		const body = String(form.get('body') ?? '').trim();
		if (author.length < 2 || body.length < 2) {
			return fail(400, { commentError: 'Escribe tu nombre y un comentario.' });
		}
		if (author.length > 60 || body.length > 1000) {
			return fail(400, { commentError: 'El texto es demasiado largo.' });
		}
		db.prepare(`INSERT INTO comments (artwork_id, author, body) VALUES (?, ?, ?)`).run(
			artwork.id,
			author,
			body
		);
		return { commented: true };
	},

	contact: async ({ params, request }) => {
		const artwork = getArtworkBySlug(params.slug);
		if (!artwork) return fail(404);
		const form = await request.formData();
		if (form.get('website')) return { contacted: true };
		const name = String(form.get('name') ?? '').trim();
		const email = String(form.get('email') ?? '').trim();
		const body = String(form.get('body') ?? '').trim();
		if (name.length < 2 || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || body.length < 2) {
			return fail(400, { contactError: 'Revisa nombre, email y mensaje.' });
		}
		const artist = db
			.prepare(`SELECT * FROM artists WHERE id = ?`)
			.get(artwork.artist_id) as Artist;
		db.prepare(
			`INSERT INTO messages (artist_id, name, email, body) VALUES (?, ?, ?, ?)`
		).run(artist.id, name, email, body);

		const to = artist.email || process.env.CONTACT_FALLBACK || 'ergoegos@gmail.com';
		await sendMail({
			to,
			replyTo: email,
			subject: `Nou Art · mensaje sobre "${artwork.title}"`,
			text: `Nuevo mensaje desde nouart.org\n\nObra: ${artwork.title}\nArtista: ${artist.name}\nDe: ${name} <${email}>\n\n${body}`
		});
		return { contacted: true };
	}
};
