// Contenido editable del sitio Nou Art (textos de marca, servicios, testimonios,
// datos de contacto). Un único sitio donde tocar las cosas "de brochure".
// Adaptado del sitio original (SITE123) manteniendo el estilo propio.

export const site = {
	name: 'Nou Art',
	tagline: 'Cultura que une a la comunidad',
	heroLead:
		'Talleres, eventos y proyectos culturales en Nou Barris para crear, compartir y participar.',
	// Frase-banda estilo "promo" del sitio original.
	promoTitle: 'Vive el arte de cerca',
	promoLead: 'Únete a nuestras actividades y haz comunidad a través de la cultura.',
	about:
		'Nou Art es una asociación cultural sin ánimo de lucro que impulsa el arte como motor de participación comunitaria en Nou Barris. Organizamos talleres creativos y formativos para todas las edades, fomentando la expresión artística y el aprendizaje continuo. Además, promovemos eventos, exposiciones y actividades abiertas que conectan a artistas, vecinos y entidades locales. Acompañamos a colectivos y creadores con asesoría en el diseño y desarrollo de proyectos culturales, facilitando colaboraciones y redes en el territorio.'
};

// Datos de contacto — RELLENAR con los reales de la asociación.
// (Los del sitio original eran placeholders de la plantilla: Manhattan, etc.)
export const contact = {
	location: 'Nou Barris, Barcelona',
	email: 'hola@nouart.org',
	phone: '', // ← teléfono real (opcional); vacío = no se muestra
	hours: '' // ← p.ej. 'Lunes a viernes · 17:00–20:00'; vacío = no se muestra
};

export interface Service {
	title: string;
	body: string;
}

export const services: Service[] = [
	{
		title: 'Talleres creativos y formativos',
		body: 'Actividades prácticas para desarrollar habilidades artísticas y potenciar la creatividad en grupo.'
	},
	{
		title: 'Organización de eventos y exposiciones',
		body: 'Diseño y producción de muestras, encuentros y programación cultural para públicos diversos.'
	},
	{
		title: 'Asesoría para proyectos culturales',
		body: 'Acompañamiento para planificar, gestionar y conectar iniciativas culturales con aliados locales.'
	}
];

export interface Testimonial {
	name: string;
	role: string;
	quote: string;
	stars: number;
}

// Testimonios de muestra (adaptados) — SUSTITUIR por reales cuando los haya.
export const testimonials: Testimonial[] = [
	{
		name: 'Jordi P.',
		role: 'Coordinador de proyecto cultural vecinal',
		quote:
			'Gracias a la asesoría, nuestro proyecto pudo organizarse mejor y conseguimos colaborar con otras entidades del barrio. Un apoyo clave.',
		stars: 5
	},
	{
		name: 'Marta R.',
		role: 'Participante de talleres',
		quote:
			'Los talleres son abiertos y cercanos. He aprendido muchísimo y he conocido a gente del barrio con las mismas ganas de crear.',
		stars: 5
	},
	{
		name: 'Adam N.',
		role: 'Artista del colectivo',
		quote:
			'Exponer con Nou Art me dio visibilidad y feedback real del público. Se nota que hay comunidad detrás.',
		stars: 5
	}
];
