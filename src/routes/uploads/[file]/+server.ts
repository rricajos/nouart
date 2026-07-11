import { error } from '@sveltejs/kit';
import { createReadStream, existsSync, statSync } from 'node:fs';
import { basename, extname, join } from 'node:path';
import { Readable } from 'node:stream';
import { UPLOADS_DIR } from '$lib/server/db';
import type { RequestHandler } from './$types';

const TYPES: Record<string, string> = {
	'.jpg': 'image/jpeg',
	'.jpeg': 'image/jpeg',
	'.png': 'image/png',
	'.webp': 'image/webp',
	'.gif': 'image/gif',
	'.avif': 'image/avif',
	'.svg': 'image/svg+xml'
};

export const GET: RequestHandler = ({ params }) => {
	// basename() strips any path traversal (../) — only serve from UPLOADS_DIR.
	const name = basename(params.file);
	const path = join(UPLOADS_DIR, name);
	if (!existsSync(path) || !statSync(path).isFile()) throw error(404, 'No encontrado');

	const type = TYPES[extname(name).toLowerCase()] ?? 'application/octet-stream';
	const stream = Readable.toWeb(createReadStream(path)) as ReadableStream;
	return new Response(stream, {
		headers: {
			'Content-Type': type,
			'Cache-Control': 'public, max-age=31536000, immutable',
			// Neutralise any script embedded in SVG uploads.
			'Content-Security-Policy': "default-src 'none'; style-src 'unsafe-inline'; img-src data:"
		}
	});
};
