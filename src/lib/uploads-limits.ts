// Límites de adjuntos compartidos entre el formulario (cliente) y la validación
// del servidor. Client-safe a propósito: `$lib/server/uploads` no puede importarse
// desde un componente.
export const ATTACH_MAX_FILES = 3;
export const ATTACH_MAX_BYTES = 8 * 1024 * 1024; // 8 MB por archivo
/** Extensiones admitidas. Sin SVG: puede contener scripts. */
export const ATTACH_EXTS = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif', '.pdf'];
export const ATTACH_ACCEPT = 'image/jpeg,image/png,image/webp,image/gif,image/avif,application/pdf';
export const ATTACH_HINT = 'Imágenes o PDF · máximo 3 archivos de 8 MB cada uno';
