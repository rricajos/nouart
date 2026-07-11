# Nou Art

Portal de la asociación de artistas de **Nou Barris** — escaparate de obra en abierto,
con opiniones del público (me gusta + comentarios moderados) y contacto directo con los artistas.

- **Web pública** (SSR, SEO): galería, fichas de artista, fichas de obra.
- **Feedback**: likes, comentarios (moderados antes de publicarse), formulario de contacto por obra.
- **Panel `/admin`**: gestión de artistas y obras, moderación de comentarios, bandeja de mensajes.

## Stack

SvelteKit (Svelte 5, adapter-node) · SQLite (better-sqlite3) · Resend para email.
Sin base de datos externa: todo (BD + imágenes) vive en `DATA_DIR` (`./data` en local, volumen `/data` en producción).

## Desarrollo

```bash
npm install
node --experimental-strip-types scripts/seed.ts   # datos de demo (opcional)
npm run dev
```

Panel: http://localhost:5173/admin — contraseña por defecto `nouart` (var `ADMIN_PASSWORD`).

## Variables de entorno

Ver [`.env.example`](.env.example). Las importantes: `ADMIN_PASSWORD`, `SESSION_SECRET`,
`RESEND_API_KEY` (opcional), `DATA_DIR`.

## Producción

Ver [`DEPLOY.md`](DEPLOY.md) — Docker Swarm + Traefik en el VPS de ricajos, dominio `nouart.org`.

## Comandos

| | |
|---|---|
| `npm run dev` | servidor de desarrollo |
| `npm run build` | build de producción (adapter-node → `build/`) |
| `npm run check` | typecheck (svelte-check) |
| `node build/index.js` | arranca el build de producción |
