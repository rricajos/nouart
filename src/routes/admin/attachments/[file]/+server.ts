import { error } from '@sveltejs/kit';
import { readFile } from 'node:fs/promises';
import { basename, extname, join } from 'node:path';
import { ATTACHMENTS_DIR } from '$lib/server/db';
import type { RequestHandler } from './$types';

const TYPES: Record<string, string> = {
	'.jpg': 'image/jpeg',
	'.jpeg': 'image/jpeg',
	'.png': 'image/png',
	'.webp': 'image/webp',
	'.gif': 'image/gif',
	'.avif': 'image/avif',
	'.pdf': 'application/pdf'
};

/**
 * Descarga de adjuntos del formulario de contacto. SOLO admin: pueden contener
 * datos personales, por eso no viven en la carpeta pública /uploads.
 */
export const GET: RequestHandler = async ({ params, locals, url }) => {
	if (!locals.admin) throw error(403, 'No autorizado');

	// basename() corta cualquier intento de path traversal (../../etc/passwd).
	const name = basename(params.file);
	const ext = extname(name).toLowerCase();
	if (!TYPES[ext]) throw error(404, 'No encontrado');

	let data: Buffer;
	try {
		data = await readFile(join(ATTACHMENTS_DIR, name));
	} catch {
		throw error(404, 'No encontrado');
	}

	// Content-Disposition: attachment → el navegador descarga en vez de renderizar.
	const download = basename(url.searchParams.get('name') ?? name);
	return new Response(new Uint8Array(data), {
		headers: {
			'Content-Type': TYPES[ext],
			'Content-Disposition': `attachment; filename="${download.replace(/"/g, '')}"`,
			'Cache-Control': 'private, no-store',
			'X-Content-Type-Options': 'nosniff'
		}
	});
};
