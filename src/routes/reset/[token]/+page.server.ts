import { fail, redirect } from '@sveltejs/kit';
import { peekToken, consumeToken, setPassword } from '$lib/server/users';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = ({ params }) => {
	return { valid: peekToken(params.token, 'reset') !== null };
};

export const actions: Actions = {
	default: async ({ request, params }) => {
		const password = String((await request.formData()).get('password') ?? '');
		if (password.length < 8)
			return fail(400, { error: 'La contraseña debe tener al menos 8 caracteres.', expired: false });
		const userId = consumeToken(params.token, 'reset');
		if (!userId)
			return fail(400, { error: 'El enlace ha caducado o ya se usó. Pide uno nuevo.', expired: true });
		setPassword(userId, password);
		throw redirect(303, '/login?reset=1');
	}
};
