import { randomBytes } from 'node:crypto';
import { writeFile, unlink } from 'node:fs/promises';
import { extname, join, basename } from 'node:path';
import { UPLOADS_DIR, ATTACHMENTS_DIR, type Attachment } from './db';
import { ATTACH_EXTS, ATTACH_MAX_BYTES, ATTACH_MAX_FILES } from '../uploads-limits';

export { ATTACH_MAX_FILES };

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

// --- Adjuntos del formulario de contacto ---
// Los sube cualquier visitante anónimo, así que somos restrictivos a propósito:
// sin SVG (puede llevar scripts), sin ejecutables, tamaño y número limitados, y
// se guardan FUERA de la carpeta pública (solo el admin los descarga).
// Los límites viven en $lib/uploads-limits para compartirlos con el formulario.
const ATTACH_ALLOWED = new Set(ATTACH_EXTS);

/** Limpia el nombre original para mostrarlo (no se usa para escribir en disco). */
function safeDisplayName(name: string): string {
	return basename(name).replace(/[^\w.\- áéíóúüñçÁÉÍÓÚÜÑÇ]/g, '').slice(0, 80) || 'archivo';
}

/**
 * Persist a contact attachment. Returns its metadata, or null when the field is
 * empty. Throws on invalid type/size.
 */
export async function saveAttachment(file: File | null): Promise<Attachment | null> {
	if (!file || file.size === 0) return null;
	if (file.size > ATTACH_MAX_BYTES) throw new Error(`"${safeDisplayName(file.name)}" supera los 8 MB.`);
	const ext = extname(file.name).toLowerCase();
	if (!ATTACH_ALLOWED.has(ext)) {
		throw new Error(`"${safeDisplayName(file.name)}": formato no admitido. Solo imágenes o PDF.`);
	}
	// El nombre en disco es aleatorio: nunca usamos el que envía el usuario.
	const stored = `${Date.now()}-${randomBytes(8).toString('hex')}${ext}`;
	await writeFile(join(ATTACHMENTS_DIR, stored), Buffer.from(await file.arrayBuffer()));
	return { file: stored, name: safeDisplayName(file.name), size: file.size };
}

export async function deleteAttachments(json: string | null | undefined): Promise<void> {
	if (!json) return;
	try {
		for (const a of JSON.parse(json) as Attachment[]) {
			await unlink(join(ATTACHMENTS_DIR, basename(a.file))).catch(() => {});
		}
	} catch {
		// JSON inválido — nada que borrar
	}
}
