<script lang="ts">
	import { site, services, contact, identity } from '$lib/content';
	// Cada apartado solo se pinta si tiene contenido (se rellenan por fases).
	const hasIdentity = $derived(
		Boolean(
			identity.history ||
				identity.mission ||
				identity.vision ||
				identity.values.length ||
				identity.goals.length
		)
	);
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

	{#if hasIdentity}
		<div class="identity">
			{#if identity.history}
				<section class="id-block">
					<h2>Historia</h2>
					<p class="muted">{identity.history}</p>
				</section>
			{/if}
			{#if identity.mission}
				<section class="id-block">
					<h2>Misión</h2>
					<p class="muted">{identity.mission}</p>
				</section>
			{/if}
			{#if identity.vision}
				<section class="id-block">
					<h2>Visión</h2>
					<p class="muted">{identity.vision}</p>
				</section>
			{/if}
			{#if identity.values.length}
				<section class="id-block">
					<h2>Valores</h2>
					<ul class="tags">
						{#each identity.values as v (v)}<li>{v}</li>{/each}
					</ul>
				</section>
			{/if}
			{#if identity.goals.length}
				<section class="id-block">
					<h2>Objetivos</h2>
					<ul class="goals">
						{#each identity.goals as g (g)}<li class="muted">{g}</li>{/each}
					</ul>
				</section>
			{/if}
		</div>
	{/if}

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

	<section class="board-link">
		<h2>Junta Directiva</h2>
		<p class="muted">
			Conoce a las personas que representan y gestionan la asociación, elegidas en asamblea.
		</p>
		<a href="/board" class="btn">Ver la Junta Directiva</a>
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
	/* "Quiénes somos" estructurado: Historia / Misión / Visión / Valores / Objetivos. */
	.identity { margin-top: 3rem; display: grid; gap: 1.4rem; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); }
	.id-block { background: var(--surface); border: 1px solid var(--line); border-left: 3px solid var(--accent); border-radius: var(--radius); padding: 1.4rem 1.5rem; }
	.id-block h2 { font-size: 1.15rem; margin-bottom: 0.5rem; }
	.id-block p { margin: 0; line-height: 1.65; }
	.tags { list-style: none; padding: 0; margin: 0; display: flex; flex-wrap: wrap; gap: 0.5rem; }
	.tags li { font-size: 0.85rem; padding: 0.25rem 0.7rem; border-radius: 999px; background: var(--accent-soft); color: var(--accent); font-weight: 600; }
	.goals { margin: 0; padding-left: 1.1rem; display: grid; gap: 0.4rem; }
	.goals li { line-height: 1.6; }
	.board-link { margin-top: 3rem; padding-top: 2rem; border-top: 1px solid var(--line); max-width: 64ch; }
	.board-link h2 { margin-bottom: 0.4rem; }
	.board-link .btn { margin-top: 0.8rem; }
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
