// Contenido editable del sitio Nou Art (textos de marca, servicios, testimonios,
// datos de contacto). Un único sitio donde tocar las cosas "de brochure".
// Adaptado del sitio original (SITE123) manteniendo el estilo propio.

/**
 * ⚠️ INTERRUPTOR DE LANZAMIENTO.
 * Mientras sea `false`, el sitio pide a los buscadores que NO lo indexen (robots.txt
 * + meta robots). Es lo que toca antes de lanzar: ahora mismo la web contiene
 * contenido de DEMO (artistas, obras, comentarios y testimonios inventados para ver
 * el diseño) y las páginas legales están sin completar. Que Google indexe artistas
 * que no existen, atribuidos a la asociación, sería un problema real.
 *
 * PONER EN `true` cuando: (1) el contenido de demo esté sustituido por el real,
 * (2) `org` tenga la identidad legal y (3) los testimonios sean auténticos.
 */
export const launched = false;

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
	hours: '', // ← p.ej. 'Lunes a viernes · 17:00–20:00'; vacío = no se muestra
	address: '' // ← dirección postal para la página de contacto; vacío = no se muestra
};

// Redes sociales. Con `url` vacía el icono sale apagado y con "Próximamente"; en cuanto
// se pega la URL se convierte en enlace real. Orden = prioridad recomendada.
// Consejo: no abrir cuentas que no se vayan a mantener (una cuenta abandonada resta).
export interface Social {
	id: 'instagram' | 'facebook' | 'whatsapp' | 'pinterest' | 'youtube';
	label: string;
	url: string;
}

export const social: Social[] = [
	{ id: 'instagram', label: 'Instagram', url: '' }, // ← p.ej. 'https://instagram.com/nouart'
	{ id: 'facebook', label: 'Facebook', url: '' },
	{ id: 'whatsapp', label: 'WhatsApp', url: '' }, // ← canal de difusión
	{ id: 'pinterest', label: 'Pinterest', url: '' }, // ← escaparate: tableros de obra
	{ id: 'youtube', label: 'YouTube', url: '' }
];

/** Redes ya activas (con URL). Vacío = aún no hay ninguna. */
export const activeSocial = () => social.filter((s) => s.url);

// Temas del formulario de contacto: se eligen ANTES de escribir, fijan el asunto y
// permiten filtrar los mensajes en el panel. El id se guarda en messages.topic.
export interface ContactTopic {
	id: string;
	label: string;
	desc: string;
	subject: string; // asunto del email que recibe la asociación
	icon: 'socio' | 'agenda' | 'artista' | 'proyecto' | 'colaborar' | 'otro';
}

// Cubren lo que realmente hace la asociación (talleres, eventos/exposiciones y
// asesoría de proyectos) más voluntariado/colaboraciones. El último es cajón de
// sastre. ⚠️ Si añades uno nuevo, su `id` es lo que se guarda en messages.topic.
export const contactTopics: ContactTopic[] = [
	{
		id: 'socio',
		label: 'Quiero asociarme',
		desc: 'Hacerte socio o socia y apoyar la asociación.',
		subject: 'Alta de socio',
		icon: 'socio'
	},
	{
		id: 'actividad',
		label: 'Participar en una actividad',
		desc: 'Inscribirte o preguntar por un taller, evento o exposición.',
		subject: 'Actividad · inscripción o consulta',
		icon: 'agenda'
	},
	{
		id: 'artista',
		label: 'Soy artista',
		desc: 'Mostrar tu obra o exponer con el colectivo.',
		subject: 'Artista · mostrar obra',
		icon: 'artista'
	},
	{
		id: 'proyecto',
		label: 'Propuesta o proyecto',
		desc: 'Proponernos una actividad o pedir asesoría para tu proyecto cultural.',
		subject: 'Propuesta · proyecto cultural',
		icon: 'proyecto'
	},
	{
		id: 'colaborar',
		label: 'Colaborar o ser voluntario/a',
		desc: 'Echar una mano, ceder un espacio o apoyar como entidad.',
		subject: 'Colaboración · voluntariado',
		icon: 'colaborar'
	},
	{
		id: 'otro',
		label: 'Otra consulta',
		desc: 'Prensa, sugerencias o cualquier otra cosa.',
		subject: 'Consulta general',
		icon: 'otro'
	}
];

export const topicById = (id: string | null | undefined) =>
	contactTopics.find((t) => t.id === id);

// "Quiénes somos" estructurado, como pide el doc de estructura de la asociación.
// Cada apartado APARECE SOLO SI tiene contenido → se pueden ir rellenando por fases
// sin que la página muestre secciones vacías.
export const identity = {
	history: '', // ← Historia: cómo y cuándo nace la asociación
	mission: '', // ← Misión: a qué se dedica (si se deja vacío se usa site.about)
	vision: '', // ← Visión: dónde quiere llegar
	values: [] as string[], // ← Valores, p.ej. ['Proximidad', 'Cooperación']
	goals: [] as string[] // ← Objetivos concretos
};

// ⚠️ IDENTIDAD LEGAL — OBLIGATORIO rellenar antes de considerar el sitio publicado.
// Estos datos son los que exige la LSSI en el Aviso Legal y la normativa de datos
// (GDPR/LOPDGDD) en la Política de Privacidad. Mientras estén vacíos, las páginas
// legales muestran un aviso de "pendiente" en lugar de inventar datos.
export const org = {
	legalName: '', // ← nombre legal completo, p.ej. 'Associació Cultural Nou Art'
	nif: '', // ← CIF/NIF de la asociación
	address: '', // ← domicilio social completo
	registry: '', // ← Registro de Asociaciones y nº de inscripción
	email: 'hola@nouart.org'
};

/** true cuando la identidad legal está completa (las páginas legales dejan el aviso). */
export const orgReady = Boolean(org.legalName && org.nif && org.address);

// --- Hazte socio ---
export interface Fee {
	name: string;
	price: string;
	note?: string;
}

export const membership = {
	lead: 'Hacerte socio o socia de Nou Art es apoyar la cultura de barrio y formar parte de una comunidad que crea, comparte y participa en Nou Barris.',
	// Ventajas — REVISAR con la asociación (son propuestas razonables, no oficiales).
	benefits: [
		'Participación en talleres y actividades, con condiciones preferentes.',
		'Prioridad de inscripción en actividades con plazas limitadas.',
		'Posibilidad de exponer y difundir tu obra dentro del colectivo.',
		'Información anticipada de la agenda y las convocatorias.',
		'Voz y voto en la asamblea de la asociación.'
	],
	// ⚠️ CUOTAS — RELLENAR. Vacío = la página invita a consultar por contacto
	// (no publicamos importes inventados).
	fees: [] as Fee[],
	steps: [
		'Escríbenos con tus datos y te explicamos el proceso.',
		'Te confirmamos la cuota y la forma de pago vigente.',
		'Te damos de alta y pasas a formar parte de la asociación.'
	]
};

// --- Junta directiva --- ⚠️ RELLENAR. Vacío = la página muestra aviso de actualización.
export interface BoardMember {
	role: string; // p.ej. 'Presidencia'
	name: string;
	bio?: string;
	photo?: string; // nombre de fichero subido a /uploads, opcional
}

export const board: BoardMember[] = [];

// --- Preguntas frecuentes --- (revisar/ampliar con la asociación)
export const faq: { q: string; a: string }[] = [
	{
		q: '¿Cómo me hago socio o socia?',
		a: 'Desde la página "Hazte socio" te explicamos las ventajas y el proceso. Escríbenos y te acompañamos en el alta.'
	},
	{
		q: '¿Hay que ser artista para participar?',
		a: 'No. Nou Art está abierta a cualquier persona interesada en la cultura del barrio, seas artista, vecina o simplemente tengas ganas de participar.'
	},
	{
		q: '¿Cómo puedo participar en las actividades?',
		a: 'Consulta la Agenda: cada actividad indica fecha, hora y lugar. Si necesitas inscripción o más información, escríbenos desde Contacto.'
	},
	{
		q: 'Soy artista, ¿cómo muestro mi obra?',
		a: 'Crea una cuenta de tipo Artista. El equipo revisa la solicitud y, al aprobarla, podrás editar tu perfil y publicar tu obra desde tu estudio.'
	},
	{
		q: '¿Cómo puedo colaborar sin ser socio?',
		a: 'Puedes colaborar como voluntariado, cediendo espacios o proponiendo proyectos conjuntos. Escríbenos y lo hablamos.'
	},
	{
		q: '¿Qué hago si no puedo asistir a una actividad?',
		a: 'Avísanos cuanto antes por email para poder liberar tu plaza y que otra persona pueda aprovecharla.'
	}
];

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
