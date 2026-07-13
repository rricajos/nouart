import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

// El registro ahora vive dentro del flujo único de /login (email primero).
export const load: PageServerLoad = () => {
	throw redirect(308, '/login');
};
