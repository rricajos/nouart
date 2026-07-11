import { randomBytes } from 'node:crypto';
import { writeFile, unlink } from 'node:fs/promises';
import { extname, join, basename } from 'node:path';
import { UPLOADS_DIR } from './db';

const ALLOWED = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif']);
const MAX_BYTES = 12 * 1024 * 1024; // 12 MB

/**
 * Persist an uploaded image to the uploads dir. Returns the stored filename
 * (to save in the DB) or null when the field is empty. Throws on invalid input.
 */
export async function saveImage(file: File | null): Promise<string | null> {
	if (!file || file.size === 0) return null;
	if (file.size > MAX_BYTES) throw new Error('La imagen supera el tamaño máximo (12 MB).');
	const ext = extname(file.name).toLowerCase();
	if (!ALLOWED.has(ext)) throw new Error('Formato no admitido. Usa JPG, PNG, WEBP, GIF o AVIF.');
	const name = `${Date.now()}-${randomBytes(6).toString('hex')}${ext}`;
	const buf = Buffer.from(await file.arrayBuffer());
	await writeFile(join(UPLOADS_DIR, name), buf);
	return name;
}

/** Remove a previously stored upload (best-effort). */
export async function deleteImage(name: string | null | undefined): Promise<void> {
	if (!name) return;
	try {
		await unlink(join(UPLOADS_DIR, basename(name)));
	} catch {
		// already gone — ignore
	}
}
