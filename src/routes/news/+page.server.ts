import { listPublishedNews } from '$lib/server/queries';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = () => ({ news: listPublishedNews() });
