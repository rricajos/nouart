<script lang="ts">
	import { site, services, contact } from '$lib/content';
</script>

<svelte:head>
	<title>Acerca de Nou Art</title>
	<meta name="description" content="Qué es Nou Art, asociación cultural de Nou Barris: talleres, eventos, exposiciones y proyectos culturales." />
</svelte:head>

<div class="wrap page">
	<p class="eyebrow">Quiénes somos</p>
	<h1>Acerca de {site.name}</h1>

	<div class="prose">
		<p class="lead">{site.about}</p>
	</div>

	<section class="services-block">
		<h2>Qué hacemos</h2>
		<div class="services">
			{#each services as s (s.title)}
				<article class="service">
					<h3>{s.title}</h3>
					<p class="muted">{s.body}</p>
				</article>
			{/each}
		</div>
	</section>

	<section class="join">
		<h2>¿Eres artista o vecino de Nou Barris?</h2>
		<p class="muted">
			Si haces arte en el distrito o quieres participar en nuestras actividades, nos encantará
			conocerte. Escríbenos a <a href="mailto:{contact.email}">{contact.email}</a> o desde la
			página de <a href="/contact">contacto</a>.
		</p>
		<a href="/contact" class="btn btn-primary">Contacta con nosotros</a>
	</section>
</div>

<style>
	.page { padding: 2.5rem 0; }
	.prose { max-width: 64ch; }
	.lead { font-size: 1.25rem; }
	.services-block { margin-top: 3rem; }
	.services-block h2, .join h2 { margin-bottom: 1.2rem; }
	.services { display: grid; gap: 1.4rem; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); }
	.service { padding: 1.6rem; background: var(--surface); border: 1px solid var(--line); border-radius: var(--radius); box-shadow: var(--shadow); }
	.service::before { content: ''; display: block; width: 34px; height: 3px; background: var(--accent); border-radius: 2px; margin-bottom: 1rem; }
	.service h3 { font-size: 1.15rem; margin-bottom: 0.5rem; }
	.join { margin-top: 3rem; padding-top: 2rem; border-top: 1px solid var(--line); max-width: 64ch; }
	/* Acotado a los enlaces del párrafo: si no, también teñía el .btn-primary de color
	   acento sobre fondo acento y el texto del botón quedaba invisible. */
	.join p a { color: var(--accent); text-decoration: underline; }
	.join .btn { margin-top: 0.5rem; }
</style>
