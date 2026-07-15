import { db, type Artist, type Artwork, type Event, type News } from './db';
import { saveImage, deleteImage } from './uploads';
import { uniqueSlug } from './util';

const artistSlugExists = (slug: string, exceptId = 0) =>
	!!db.prepare(`SELECT 1 FROM artists WHERE slug = ? AND id != ?`).get(slug, exceptId);
const artworkSlugExists = (slug: string, exceptId = 0) =>
	!!db.prepare(`SELECT 1 FROM artworks WHERE slug = ? AND id != ?`).get(slug, exceptId);
const eventSlugExists = (slug: string, exceptId = 0) =>
	!!db.prepare(`SELECT 1 FROM events WHERE slug = ? AND id != ?`).get(slug, exceptId);
const newsSlugExists = (slug: string, exceptId = 0) =>
	!!db.prepare(`SELECT 1 FROM news WHERE slug = ? AND id != ?`).get(slug, exceptId);

/** Create or update an artist from a submitted form. Returns the artist id. */
export async function saveArtist(form: FormData, existing: Artist | null): Promise<number> {
	const name = String(form.get('name') ?? '').trim();
	if (!name) throw new Error('El nombre es obligatorio.');

	const data = {
		name,
		discipline: String(form.get('discipline') ?? '').trim(),
		bio: String(form.get('bio') ?? '').trim(),
		email: String(form.get('email') ?? '').trim() || null,
		instagram: String(form.get('instagram') ?? '').trim().replace(/^@/, '') || null,
		website: String(form.get('website') ?? '').trim() || null
	};

	const newPhoto = await saveImage(form.get('photo') as File | null);

	if (existing) {
		if (newPhoto) await deleteImage(existing.photo);
		db.prepare(
			`UPDATE artists SET name=@name, discipline=@discipline, bio=@bio, email=@email,
			 instagram=@instagram, website=@website ${newPhoto ? ', photo=@photo' : ''} WHERE id=@id`
		).run({ ...data, photo: newPhoto, id: existing.id });
		return existing.id;
	}

	const slug = uniqueSlug(name, (s) => artistSlugExists(s), 'artist');
	// Los artistas se listan por orden ALFABÉTICO, así que ya no calculamos `sort`
	// (la columna queda en su valor por defecto y sin uso para artistas).
	const info = db
		.prepare(
			`INSERT INTO artists (slug, name, discipline, bio, email, instagram, website, photo)
			 VALUES (@slug, @name, @discipline, @bio, @email, @instagram, @website, @photo)`
		)
		.run({ ...data, slug, photo: newPhoto });
	return Number(info.lastInsertRowid);
}

/** Create or update an artwork from a submitted form. Returns the artwork id. */
export async function saveArtwork(form: FormData, existing: Artwork | null): Promise<number> {
	const title = String(form.get('title') ?? '').trim();
	const artistId = Number(form.get('artist_id'));
	if (!title) throw new Error('El título es obligatorio.');
	if (!artistId || !db.prepare(`SELECT 1 FROM artists WHERE id = ?`).get(artistId)) {
		throw new Error('Selecciona un artista válido.');
	}

	const data = {
		title,
		artist_id: artistId,
		description: String(form.get('description') ?? '').trim(),
		year: String(form.get('year') ?? '').trim(),
		medium: String(form.get('medium') ?? '').trim(),
		published: form.get('published') ? 1 : 0
	};

	const newImage = await saveImage(form.get('image') as File | null);

	if (existing) {
		if (newImage) await deleteImage(existing.image);
		db.prepare(
			`UPDATE artworks SET title=@title, artist_id=@artist_id, description=@description,
			 year=@year, medium=@medium, published=@published ${newImage ? ', image=@image' : ''}
			 WHERE id=@id`
		).run({ ...data, image: newImage, id: existing.id });
		return existing.id;
	}

	const artistName = (db.prepare(`SELECT name FROM artists WHERE id=?`).get(artistId) as { name: string }).name;
	const slug = uniqueSlug(`${artistName}-${title}`, (s) => artworkSlugExists(s), 'work');
	const maxSort = (db.prepare(`SELECT COALESCE(MAX(sort),0)+1 AS n FROM artworks`).get() as { n: number }).n;
	const info = db
		.prepare(
			`INSERT INTO artworks (slug, title, artist_id, description, year, medium, published, image, sort)
			 VALUES (@slug, @title, @artist_id, @description, @year, @medium, @published, @image, @sort)`
		)
		.run({ ...data, slug, image: newImage, sort: maxSort });
	return Number(info.lastInsertRowid);
}

export async function deleteArtist(id: number): Promise<void> {
	const artist = db.prepare(`SELECT * FROM artists WHERE id=?`).get(id) as Artist | undefined;
	if (!artist) return;
	const works = db.prepare(`SELECT image FROM artworks WHERE artist_id=?`).all(id) as { image: string | null }[];
	db.prepare(`DELETE FROM artists WHERE id=?`).run(id); // cascades artworks/comments/likes
	await deleteImage(artist.photo);
	for (const w of works) await deleteImage(w.image);
}

export async function deleteArtwork(id: number): Promise<void> {
	const aw = db.prepare(`SELECT image FROM artworks WHERE id=?`).get(id) as { image: string | null } | undefined;
	if (!aw) return;
	db.prepare(`DELETE FROM artworks WHERE id=?`).run(id);
	await deleteImage(aw.image);
}

/** Create or update an event from a submitted form. Returns the event id. */
export async function saveEvent(form: FormData, existing: Event | null): Promise<number> {
	const title = String(form.get('title') ?? '').trim();
	if (!title) throw new Error('El título es obligatorio.');

	const data = {
		title,
		summary: String(form.get('summary') ?? '').trim(),
		body: String(form.get('body') ?? '').trim(),
		date: String(form.get('date') ?? '').trim(),
		time: String(form.get('time') ?? '').trim(),
		location: String(form.get('location') ?? '').trim(),
		published: form.get('published') ? 1 : 0
	};

	const newImage = await saveImage(form.get('image') as File | null);

	if (existing) {
		if (newImage) await deleteImage(existing.image);
		db.prepare(
			`UPDATE events SET title=@title, summary=@summary, body=@body, date=@date, time=@time,
			 location=@location, published=@published ${newImage ? ', image=@image' : ''} WHERE id=@id`
		).run({ ...data, image: newImage, id: existing.id });
		return existing.id;
	}

	const slug = uniqueSlug(title, (s) => eventSlugExists(s), 'event');
	const info = db
		.prepare(
			`INSERT INTO events (slug, title, summary, body, date, time, location, published, image)
			 VALUES (@slug, @title, @summary, @body, @date, @time, @location, @published, @image)`
		)
		.run({ ...data, slug, image: newImage });
	return Number(info.lastInsertRowid);
}

export async function deleteEvent(id: number): Promise<void> {
	const ev = db.prepare(`SELECT image FROM events WHERE id=?`).get(id) as
		| { image: string | null }
		| undefined;
	if (!ev) return;
	db.prepare(`DELETE FROM events WHERE id=?`).run(id);
	await deleteImage(ev.image);
}

/** Create or update a news post from a submitted form. Returns the post id. */
export async function saveNews(form: FormData, existing: News | null): Promise<number> {
	const title = String(form.get('title') ?? '').trim();
	if (!title) throw new Error('El título es obligatorio.');

	const data = {
		title,
		summary: String(form.get('summary') ?? '').trim(),
		body: String(form.get('body') ?? '').trim(),
		date: String(form.get('date') ?? '').trim(),
		published: form.get('published') ? 1 : 0
	};

	const newImage = await saveImage(form.get('image') as File | null);

	if (existing) {
		if (newImage) await deleteImage(existing.image);
		db.prepare(
			`UPDATE news SET title=@title, summary=@summary, body=@body, date=@date,
			 published=@published ${newImage ? ', image=@image' : ''} WHERE id=@id`
		).run({ ...data, image: newImage, id: existing.id });
		return existing.id;
	}

	const slug = uniqueSlug(title, (s) => newsSlugExists(s), 'news');
	const info = db
		.prepare(
			`INSERT INTO news (slug, title, summary, body, date, published, image)
			 VALUES (@slug, @title, @summary, @body, @date, @published, @image)`
		)
		.run({ ...data, slug, image: newImage });
	return Number(info.lastInsertRowid);
}

export async function deleteNews(id: number): Promise<void> {
	const n = db.prepare(`SELECT image FROM news WHERE id=?`).get(id) as
		| { image: string | null }
		| undefined;
	if (!n) return;
	db.prepare(`DELETE FROM news WHERE id=?`).run(id);
	await deleteImage(n.image);
}
