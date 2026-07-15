import { error, fail, redirect } from '@sveltejs/kit';
import { db, type News } from '$lib/server/db';
import { saveNews } from '$lib/server/admin';
import type { Actions, PageServerLoad } from './$types';

function getPost(id: number): News {
	const n = db.prepare(`SELECT * FROM news WHERE id = ?`).get(id) as News | undefined;
	if (!n) throw error(404, 'Noticia no encontrada');
	return n;
}

export const load: PageServerLoad = ({ params }) => ({ post: getPost(Number(params.id)) });

export const actions: Actions = {
	default: async ({ request, params }) => {
		const existing = getPost(Number(params.id));
		const form = await request.formData();
		try {
			await saveNews(form, existing);
		} catch (e) {
			return fail(400, { error: e instanceof Error ? e.message : 'No se pudo guardar.' });
		}
		throw redirect(303, '/admin/news');
	}
};
