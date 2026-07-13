import { consumeToken, setEmailVerified } from '$lib/server/users';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ params }) => {
	const userId = consumeToken(params.token, 'verify');
	if (!userId) return { ok: false };
	setEmailVerified(userId);
	return { ok: true };
};
