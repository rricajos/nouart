import { getUserByEmail, createToken } from '$lib/server/users';
import { sendResetEmail } from '$lib/server/notify';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ request, url }) => {
		const email = String((await request.formData()).get('email') ?? '').trim();
		const user = getUserByEmail(email);
		if (user) {
			await sendResetEmail(url.origin, user.email, user.name, createToken(user.id, 'reset'));
		}
		// Respuesta genérica: nunca revelamos si el email tiene cuenta.
		return { sent: true };
	}
};
