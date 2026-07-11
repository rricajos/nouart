/**
 * Seed de demostración para Nou Art (autocontenido, sin imports del proyecto).
 * Genera arte abstracto generativo como imágenes de las obras.
 *
 * Local:      DATA_DIR=./data node scripts/seed.cjs
 * Contenedor: docker cp scripts/seed.cjs <c>:/app/ && docker exec -w /app -e DATA_DIR=/data <c> node seed.cjs
 *
 * Idempotente: limpia y reinserta los datos de muestra.
 */
const Database = require('better-sqlite3');
const { existsSync, mkdirSync, writeFileSync } = require('node:fs');
const { join } = require('node:path');

const DATA_DIR = process.env.DATA_DIR || join(process.cwd(), 'data');
const UPLOADS_DIR = join(DATA_DIR, 'uploads');
if (!existsSync(UPLOADS_DIR)) mkdirSync(UPLOADS_DIR, { recursive: true });

const db = new Database(join(DATA_DIR, 'nouart.db'));
db.pragma('foreign_keys = ON');
// Asegura el esquema por si el seed corre antes que la app.
db.exec(`
CREATE TABLE IF NOT EXISTS artists (id INTEGER PRIMARY KEY AUTOINCREMENT, slug TEXT UNIQUE NOT NULL, name TEXT NOT NULL, discipline TEXT NOT NULL DEFAULT '', bio TEXT NOT NULL DEFAULT '', photo TEXT, website TEXT, instagram TEXT, email TEXT, sort INTEGER NOT NULL DEFAULT 0, created_at TEXT NOT NULL DEFAULT (datetime('now')));
CREATE TABLE IF NOT EXISTS artworks (id INTEGER PRIMARY KEY AUTOINCREMENT, slug TEXT UNIQUE NOT NULL, artist_id INTEGER NOT NULL REFERENCES artists(id) ON DELETE CASCADE, title TEXT NOT NULL, description TEXT NOT NULL DEFAULT '', year TEXT NOT NULL DEFAULT '', medium TEXT NOT NULL DEFAULT '', image TEXT, published INTEGER NOT NULL DEFAULT 1, sort INTEGER NOT NULL DEFAULT 0, created_at TEXT NOT NULL DEFAULT (datetime('now')));
CREATE TABLE IF NOT EXISTS comments (id INTEGER PRIMARY KEY AUTOINCREMENT, artwork_id INTEGER NOT NULL REFERENCES artworks(id) ON DELETE CASCADE, author TEXT NOT NULL, body TEXT NOT NULL, approved INTEGER NOT NULL DEFAULT 0, created_at TEXT NOT NULL DEFAULT (datetime('now')));
CREATE TABLE IF NOT EXISTS likes (artwork_id INTEGER NOT NULL REFERENCES artworks(id) ON DELETE CASCADE, visitor TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT (datetime('now')), PRIMARY KEY (artwork_id, visitor));
`);

const slugify = (s) =>
	s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim()
		.replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60);

// --- PRNG determinista (mulberry32) ---
function rng(seed) {
	let a = seed >>> 0;
	return () => {
		a = (a + 0x6d2b79f5) | 0;
		let t = Math.imul(a ^ (a >>> 15), 1 | a);
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

const PALETTES = [
	{ bg: '#1f2a44', c: ['#e8615a', '#f2b134', '#f6ede1', '#3ec6b0'] },
	{ bg: '#f3ece1', c: ['#b23a2e', '#e0a83e', '#2c5f5a', '#d97a56'] },
	{ bg: '#2a2320', c: ['#e58b79', '#edb24e', '#8bb6a0', '#f6ede1'] },
	{ bg: '#0e4d54', c: ['#f2b134', '#e8615a', '#f6ede1', '#7fd1c4'] },
	{ bg: '#e7ddcf', c: ['#3d5a80', '#ee6c4d', '#293241', '#98c1d9'] },
	{ bg: '#3b2b3a', c: ['#e0708a', '#f2b134', '#6dc5a3', '#f6ede1'] },
	{ bg: '#c94c33', c: ['#f6ede1', '#2a1e1c', '#edb24e', '#8a2f22'] },
	{ bg: '#14322e', c: ['#f4a259', '#f6ede1', '#e76f51', '#bc4749'] }
];

function art(seed, portrait = false) {
	const r = rng(seed + 1);
	const S = 800;
	const pal = PALETTES[Math.floor(r() * PALETTES.length)];
	const pick = () => pal.c[Math.floor(r() * pal.c.length)];
	const rnd = (a, b) => a + r() * (b - a);
	let s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${S} ${S}"><rect width="${S}" height="${S}" fill="${pal.bg}"/>`;
	const style = portrait ? 4 : Math.floor(r() * 4);

	if (style === 0) {
		// geométrico: rectángulos y círculos superpuestos
		for (let i = 0; i < 9; i++) {
			const op = rnd(0.5, 1).toFixed(2);
			if (r() < 0.5) {
				const w = rnd(120, 380), h = rnd(120, 380);
				s += `<rect x="${rnd(-40, S - 100).toFixed(0)}" y="${rnd(-40, S - 100).toFixed(0)}" width="${w.toFixed(0)}" height="${h.toFixed(0)}" fill="${pick()}" opacity="${op}" transform="rotate(${rnd(-20, 20).toFixed(0)} 400 400)"/>`;
			} else {
				s += `<circle cx="${rnd(0, S).toFixed(0)}" cy="${rnd(0, S).toFixed(0)}" r="${rnd(60, 220).toFixed(0)}" fill="${pick()}" opacity="${op}"/>`;
			}
		}
	} else if (style === 1) {
		// campos de color: bandas
		const vert = r() < 0.5;
		let pos = 0;
		while (pos < S) {
			const band = rnd(50, 160);
			if (vert) s += `<rect x="${pos.toFixed(0)}" y="0" width="${band.toFixed(0)}" height="${S}" fill="${pick()}"/>`;
			else s += `<rect x="0" y="${pos.toFixed(0)}" width="${S}" height="${band.toFixed(0)}" fill="${pick()}"/>`;
			pos += band;
		}
		for (let i = 0; i < 3; i++)
			s += `<circle cx="${rnd(150, 650).toFixed(0)}" cy="${rnd(150, 650).toFixed(0)}" r="${rnd(50, 120).toFixed(0)}" fill="${pick()}" opacity="0.85"/>`;
	} else if (style === 2) {
		// puntos / círculos concéntricos
		const cx = rnd(200, 600), cy = rnd(200, 600);
		for (let rad = 340; rad > 20; rad -= rnd(28, 60))
			s += `<circle cx="${cx.toFixed(0)}" cy="${cy.toFixed(0)}" r="${rad.toFixed(0)}" fill="none" stroke="${pick()}" stroke-width="${rnd(6, 22).toFixed(0)}"/>`;
		for (let i = 0; i < 40; i++)
			s += `<circle cx="${rnd(0, S).toFixed(0)}" cy="${rnd(0, S).toFixed(0)}" r="${rnd(6, 26).toFixed(0)}" fill="${pick()}" opacity="${rnd(0.4, 1).toFixed(2)}"/>`;
	} else {
		// orgánico: blobs translúcidos + arcos (también estilo retrato, más suave)
		const n = portrait ? 5 : 8;
		for (let i = 0; i < n; i++)
			s += `<circle cx="${rnd(0, S).toFixed(0)}" cy="${rnd(0, S).toFixed(0)}" r="${rnd(120, 300).toFixed(0)}" fill="${pick()}" opacity="${(portrait ? rnd(0.25, 0.5) : rnd(0.35, 0.7)).toFixed(2)}"/>`;
		if (!portrait)
			for (let i = 0; i < 3; i++) {
				const y = rnd(150, 650);
				s += `<path d="M0 ${y.toFixed(0)} Q 400 ${(y + rnd(-200, 200)).toFixed(0)} 800 ${y.toFixed(0)}" fill="none" stroke="${pick()}" stroke-width="${rnd(8, 26).toFixed(0)}" opacity="0.8"/>`;
			}
	}
	return s + '</svg>';
}

let imgIdx = 0;
function saveArt(title, portrait) {
	const name = `seed-${imgIdx}-${slugify(title)}.svg`;
	writeFileSync(join(UPLOADS_DIR, name), art(imgIdx * 97 + title.length, portrait));
	imgIdx++;
	return name;
}

const artists = [
	{ name: 'Mireia Colom', discipline: 'Pintura y collage', instagram: 'mireiacolom.art',
		bio: 'Artista de Roquetes que trabaja el collage matérico con materiales recuperados del barrio. Su obra explora la memoria de los edificios de Nou Barris.',
		works: [
			['Ventanas de Trinitat', '2024', 'Collage sobre madera'],
			['Roquetes en rojo', '2023', 'Acrílico y papel'],
			['Escalera arriba', '2024', 'Técnica mixta'],
			['Medianera', '2022', 'Óleo sobre lienzo']
		] },
	{ name: 'Óscar Ferrán', discipline: 'Fotografía', website: 'https://oscarferran.example',
		bio: 'Fotógrafo documental centrado en la vida cotidiana de los mercados y plazas del distrito. Blanco y negro y mucha paciencia.',
		works: [
			['Mercado de Guineueta', '2023', 'Fotografía, copia baritada'],
			['Domingo en Via Júlia', '2024', 'Fotografía digital'],
			['Luz de tarde', '2023', 'Fotografía analógica']
		] },
	{ name: 'Lucía Peña', discipline: 'Ilustración', instagram: 'lucia.mural',
		bio: 'Ilustradora y muralista. Ha pintado varias medianeras del distrito con vecinas y vecinos como protagonistas.',
		works: [
			['Las vecinas del 7', '2024', 'Ilustración digital'],
			['Fiesta mayor', '2023', 'Gouache'],
			['Retrato del portero', '2022', 'Tinta']
		] },
	{ name: 'Adam Ndiaye', discipline: 'Escultura',
		bio: 'Escultor que reutiliza hierro y madera de derribo. Piezas grandes, gesto tosco, ternura escondida.',
		works: [
			['Torre humilde', '2024', 'Hierro soldado'],
			['Nido', '2023', 'Madera y alambre']
		] }
];

const insArtist = db.prepare(`INSERT INTO artists (slug, name, discipline, bio, photo, website, instagram, sort) VALUES (@slug,@name,@discipline,@bio,@photo,@website,@instagram,@sort)`);
const insWork = db.prepare(`INSERT INTO artworks (slug, artist_id, title, description, year, medium, image, sort) VALUES (@slug,@artist_id,@title,@description,@year,@medium,@image,@sort)`);
const insComment = db.prepare(`INSERT INTO comments (artwork_id, author, body, approved) VALUES (?,?,?,1)`);
const insLike = db.prepare(`INSERT OR IGNORE INTO likes (artwork_id, visitor) VALUES (?,?)`);

const COMMENTS = [
	['Vecina de Roquetes', '¡Preciosa! Reconozco esas ventanas.'],
	['Joan', 'Me encanta el uso del color.'],
	['Marta', 'Qué bien capta el ambiente del barrio.'],
	['Pep', 'Enhorabuena por la exposición.'],
	['Nuria', 'Esta pieza transmite muchísimo.']
];

const tx = db.transaction(() => {
	db.exec('DELETE FROM likes; DELETE FROM comments; DELETE FROM artworks; DELETE FROM artists;');
	db.exec("DELETE FROM sqlite_sequence WHERE name IN ('artists','artworks')");
	artists.forEach((a, ai) => {
		const photo = saveArt(a.name, true);
		const info = insArtist.run({ slug: slugify(a.name), name: a.name, discipline: a.discipline, bio: a.bio, photo, website: a.website || null, instagram: a.instagram || null, sort: ai });
		const artistId = Number(info.lastInsertRowid);
		a.works.forEach((w, wi) => {
			const [title, year, medium] = w;
			const image = saveArt(`${a.name}-${title}`, false);
			const info2 = insWork.run({ slug: slugify(`${a.name}-${title}`), artist_id: artistId, title, description: `${medium}. Obra de ${a.name} expuesta en la muestra del colectivo Nou Art.`, year, medium, image, sort: wi });
			const awId = Number(info2.lastInsertRowid);
			// likes variados y algún comentario en las primeras obras
			const nLikes = 3 + ((ai * 7 + wi * 3) % 22);
			for (let k = 0; k < nLikes; k++) insLike.run(awId, `seed-visitor-${awId}-${k}`);
			if ((ai + wi) % 3 === 0) {
				const c1 = COMMENTS[(awId) % COMMENTS.length];
				const c2 = COMMENTS[(awId + 2) % COMMENTS.length];
				insComment.run(awId, c1[0], c1[1]);
				if (wi === 0) insComment.run(awId, c2[0], c2[1]);
			}
		});
	});
});
tx();

const n = db.prepare('SELECT COUNT(*) a FROM artists').get().a;
const m = db.prepare('SELECT COUNT(*) a FROM artworks').get().a;
const c = db.prepare('SELECT COUNT(*) a FROM comments').get().a;
const l = db.prepare('SELECT COUNT(*) a FROM likes').get().a;
console.log(`Seed OK: ${n} artistas, ${m} obras, ${c} comentarios, ${l} me gusta.`);
