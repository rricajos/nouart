<script lang="ts">
	import { page } from '$app/state';
	import { formatEventDate } from '$lib/date';
	let { data } = $props();
	const e = $derived(data.event);
</script>

<svelte:head>
	<title>{e.title} · Agenda · Nou Art</title>
	<meta name="description" content={e.summary || e.title} />
	<meta property="og:title" content="{e.title} · Nou Art" />
	<meta property="og:description" content={e.summary || 'Actividad de Nou Art en Nou Barris.'} />
	{#if e.image}<meta property="og:image" content="{page.url.origin}/uploads/{e.image}" />{/if}
</svelte:head>

<div class="wrap page">
	<a href="/agenda" class="back muted">← Agenda</a>

	<article>
		<p class="eyebrow">{formatEventDate(e.date)}{#if e.time} · {e.time}{/if}</p>
		<h1>{e.title}</h1>
		{#if e.location}
			<p class="loc">
				<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
					<path d="M12 21s-6-5.3-6-10a6 6 0 1 1 12 0c0 4.7-6 10-6 10z" />
					<circle cx="12" cy="11" r="2.2" />
				</svg>
				{e.location}
			</p>
		{/if}

		{#if e.image}
			<div class="hero"><img src="/uploads/{e.image}" alt={e.title} /></div>
		{/if}

		{#if e.summary}<p class="lead">{e.summary}</p>{/if}
		{#if e.body}
			<div class="body">
				{#each e.body.split('\n') as para}
					{#if para.trim()}<p>{para}</p>{/if}
				{/each}
			</div>
		{/if}

		<div class="cta">
			<p class="muted">¿Te interesa participar o quieres más información?</p>
			<a href="/contact" class="btn btn-primary">Contacta con nosotros</a>
		</div>
	</article>
</div>

<style>
	.page { padding: 2.5rem 0 4rem; }
	.back { display: inline-block; margin-bottom: 1.2rem; font-size: 0.9rem; }
	article { max-width: 760px; }
	.eyebrow { text-transform: none; letter-spacing: 0.02em; font-size: 0.9rem; }
	h1 { margin: 0.2rem 0 0.5rem; }
	.loc { color: var(--muted); margin-bottom: 1.5rem; display: inline-flex; align-items: center; gap: 0.4rem; }
	.loc svg { color: var(--accent); flex: none; }
	.hero { border-radius: var(--radius); overflow: hidden; margin: 0.5rem 0 1.8rem; border: 1px solid var(--line); }
	.hero img { width: 100%; max-height: 460px; object-fit: cover; display: block; }
	.lead { font-size: 1.2rem; line-height: 1.55; }
	.body { margin-top: 1rem; }
	.body p { line-height: 1.7; }
	.cta { margin-top: 2.5rem; padding-top: 1.8rem; border-top: 1px solid var(--line); }
	.cta p { margin-bottom: 0.8rem; }
</style>
