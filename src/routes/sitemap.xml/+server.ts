import { db } from '$lib/server/db';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = ({ url }) => {
	const base = `${url.protocol}//${url.host}`;
	const artists = db.prepare(`SELECT slug FROM artists`).all() as { slug: string }[];
	const artworks = db
		.prepare(`SELECT slug FROM artworks WHERE published = 1`)
		.all() as { slug: string }[];
	const events = db
		.prepare(`SELECT slug FROM events WHERE published = 1`)
		.all() as { slug: string }[];

	const urls = [
		'',
		'/agenda',
		'/gallery',
		'/artists',
		'/about',
		'/board',
		'/join',
		'/faq',
		'/contact',
		'/terms',
		'/legal',
		'/privacy',
		'/cookies',
		...events.map((e) => `/agenda/${e.slug}`),
		...artists.map((a) => `/artist/${a.slug}`),
		...artworks.map((w) => `/work/${w.slug}`)
	];

	const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `\t<url><loc>${base}${u}</loc></url>`).join('\n')}
</urlset>`;

	return new Response(body, {
		headers: { 'Content-Type': 'application/xml', 'Cache-Control': 'max-age=3600' }
	});
};
