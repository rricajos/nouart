<script lang="ts">
	import { faq, contact } from '$lib/content';
</script>

<svelte:head>
	<title>Preguntas frecuentes · Nou Art</title>
	<meta name="description" content="Dudas habituales sobre Nou Art: cómo asociarse, participar o colaborar." />
</svelte:head>

<div class="wrap page">
	<p class="eyebrow">Ayuda</p>
	<h1>Preguntas frecuentes</h1>
	<p class="lead muted">Las dudas que nos llegan más a menudo. Si la tuya no está, escríbenos.</p>

	<div class="list">
		{#each faq as item (item.q)}
			<details>
				<summary>
					<span>{item.q}</span>
					<span class="chev" aria-hidden="true"></span>
				</summary>
				<p>{item.a}</p>
			</details>
		{/each}
	</div>

	<section class="cta">
		<h2>¿No has encontrado tu respuesta?</h2>
		<p class="muted">Escríbenos y te contestamos lo antes posible.</p>
		<div class="cta-row">
			<a href="/contact" class="btn btn-primary">Contactar</a>
			<a href="mailto:{contact.email}" class="btn">{contact.email}</a>
		</div>
	</section>
</div>

<style>
	.page { padding: 2.5rem 0 4rem; max-width: 720px; }
	h1 { margin-bottom: 0.5rem; }
	.lead { font-size: 1.15rem; margin-bottom: 2.2rem; }
	.list { display: flex; flex-direction: column; gap: 0.7rem; }
	details { background: var(--surface); border: 1px solid var(--line); border-radius: var(--radius); box-shadow: var(--shadow); }
	summary { display: flex; align-items: center; justify-content: space-between; gap: 1rem; padding: 1rem 1.2rem; cursor: pointer; font-weight: 600; list-style: none; }
	summary::-webkit-details-marker { display: none; }
	summary:hover { color: var(--accent); }
	.chev { flex: none; width: 9px; height: 9px; border-right: 2px solid var(--muted); border-bottom: 2px solid var(--muted); transform: rotate(45deg); transition: transform 0.2s; margin-top: -4px; }
	details[open] .chev { transform: rotate(-135deg); margin-top: 3px; }
	details p { margin: 0; padding: 0 1.2rem 1.2rem; line-height: 1.7; color: var(--muted); }
	.cta { margin-top: 2.5rem; background: var(--surface); border: 1px solid var(--line); border-left: 3px solid var(--accent); border-radius: var(--radius); padding: 1.6rem; }
	.cta h2 { font-size: 1.2rem; margin-bottom: 0.3rem; }
	.cta-row { display: flex; gap: 0.7rem; flex-wrap: wrap; margin-top: 1.1rem; }
</style>
