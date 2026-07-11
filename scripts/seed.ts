/**
 * Seed de demostración para Nou Art.
 * Ejecutar:  node --experimental-strip-types scripts/seed.ts
 * Idempotente: limpia y reinserta los datos de muestra.
 */
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { db, UPLOADS_DIR } from '../src/lib/server/db.ts';
import { slugify } from '../src/lib/server/util.ts';

const PALETTES = [
	['#e8615a', '#f2b134'],
	['#3d5afe', '#00bfa5'],
	['#8e24aa', '#ec407a'],
	['#00897b', '#c0ca33'],
	['#f4511e', '#6d4c41'],
	['#1e88e5', '#90caf9'],
	['#5e35b1', '#26c6da'],
	['#d81b60', '#ffb300']
];

function placeholder(title: string, i: number): string {
	const [a, b] = PALETTES[i % PALETTES.length];
	const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="1000" viewBox="0 0 1000 1000">
	<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
		<stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/>
	</linearGradient></defs>
	<rect width="1000" height="1000" fill="url(#g)"/>
	<text x="500" y="530" font-family="Georgia, serif" font-size="64" fill="#ffffff"
		text-anchor="middle" opacity="0.85">${title.replace(/&/g, '&amp;').replace(/</g, '&lt;')}</text>
</svg>`;
	const name = `seed-${i}-${slugify(title)}.svg`;
	writeFileSync(join(UPLOADS_DIR, name), svg);
	return name;
}

const artists = [
	{
		name: 'Mireia Colom',
		discipline: 'Pintura y collage',
		bio: 'Artista de Roquetes que trabaja el collage matérico con materiales recuperados del barrio. Su obra explora la memoria de los edificios de Nou Barris.',
		instagram: 'mireiacolom.art',
		works: [
			{ title: 'Ventanas de Trinitat', year: '2024', medium: 'Collage sobre madera' },
			{ title: 'Roquetes en rojo', year: '2023', medium: 'Acrílico y papel' },
			{ title: 'Escalera arriba', year: '2024', medium: 'Técnica mixta' }
		]
	},
	{
		name: 'Óscar Ferrán',
		discipline: 'Fotografía',
		bio: 'Fotógrafo documental centrado en la vida cotidiana de los mercados y plazas del distrito. Blanco y negro y mucha paciencia.',
		website: 'https://oscarferran.example',
		works: [
			{ title: 'Mercado de Guineueta', year: '2023', medium: 'Fotografía, copia baritada' },
			{ title: 'Domingo en Via Júlia', year: '2024', medium: 'Fotografía digital' }
		]
	},
	{
		name: 'Lucía Peña',
		discipline: 'Ilustración',
		bio: 'Ilustradora y muralista. Ha pintado varias medianeras del distrito con vecinas y vecinos como protagonistas.',
		instagram: 'lucia.mural',
		works: [
			{ title: 'Las vecinas del 7', year: '2024', medium: 'Ilustración digital' },
			{ title: 'Fiesta mayor', year: '2023', medium: 'Gouache' },
			{ title: 'Retrato del portero', year: '2022', medium: 'Tinta' }
		]
	},
	{
		name: 'Adam Ndiaye',
		discipline: 'Escultura',
		bio: 'Escultor que reutiliza hierro y madera de derribo. Piezas grandes, gesto tosco, ternura escondida.',
		works: [
			{ title: 'Torre humilde', year: '2024', medium: 'Hierro soldado' },
			{ title: 'Nido', year: '2023', medium: 'Madera y alambre' }
		]
	}
];

const tx = db.transaction(() => {
	db.exec('DELETE FROM likes; DELETE FROM comments; DELETE FROM artworks; DELETE FROM artists;');
	db.exec("DELETE FROM sqlite_sequence WHERE name IN ('artists','artworks')");

	const insArtist = db.prepare(
		`INSERT INTO artists (slug, name, discipline, bio, photo, website, instagram, sort)
		 VALUES (@slug, @name, @discipline, @bio, @photo, @website, @instagram, @sort)`
	);
	const insWork = db.prepare(
		`INSERT INTO artworks (slug, artist_id, title, description, year, medium, image, sort)
		 VALUES (@slug, @artist_id, @title, @description, @year, @medium, @image, @sort)`
	);
	const insComment = db.prepare(
		`INSERT INTO comments (artwork_id, author, body, approved) VALUES (?, ?, ?, 1)`
	);

	let imgIdx = 0;
	artists.forEach((a, ai) => {
		const photo = placeholder(a.name, imgIdx++);
		const info = insArtist.run({
			slug: slugify(a.name),
			name: a.name,
			discipline: a.discipline,
			bio: a.bio,
			photo,
			website: a.website ?? null,
			instagram: a.instagram ?? null,
			sort: ai
		});
		const artistId = Number(info.lastInsertRowid);
		a.works.forEach((w, wi) => {
			const image = placeholder(w.title, imgIdx++);
			const info2 = insWork.run({
				slug: slugify(`${a.name}-${w.title}`),
				artist_id: artistId,
				title: w.title,
				description: `${w.medium}. Obra de ${a.name} expuesta en la muestra del colectivo Nou Art.`,
				year: w.year,
				medium: w.medium,
				image,
				sort: wi
			});
			if (ai === 0 && wi === 0) {
				const awId = Number(info2.lastInsertRowid);
				insComment.run(awId, 'Vecina de Roquetes', '¡Preciosa! Reconozco esas ventanas.');
				insComment.run(awId, 'Joan', 'Me encanta el uso del color.');
			}
		});
	});
});

tx();
const n = db.prepare('SELECT COUNT(*) AS a FROM artists').get() as { a: number };
const m = db.prepare('SELECT COUNT(*) AS a FROM artworks').get() as { a: number };
console.log(`Seed OK: ${n.a} artistas, ${m.a} obras.`);
