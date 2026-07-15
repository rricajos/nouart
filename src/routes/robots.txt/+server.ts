import { launched } from '$lib/content';
import type { RequestHandler } from './$types';

/**
 * Mientras `launched` sea false pedimos NO indexar: la web aún tiene contenido de
 * demo (artistas/obras/comentarios inventados) y legales sin completar; que se
 * indexen artistas que no existen atribuidos a la asociación sería un problema.
 */
export const GET: RequestHandler = ({ url }) => {
	const body = launched
		? `User-agent: *
Disallow: /admin
Disallow: /account
Disallow: /studio
Allow: /

Sitemap: ${url.origin}/sitemap.xml
`
		: `# Sitio en preparación: contenido de demo y legales sin completar.
User-agent: *
Disallow: /
`;
	return new Response(body, {
		headers: { 'Content-Type': 'text/plain', 'Cache-Control': 'max-age=300' }
	});
};
