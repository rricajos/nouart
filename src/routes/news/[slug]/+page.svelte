<script lang="ts">
	import { page } from '$app/state';
	import { formatEventDate } from '$lib/date';
	let { data } = $props();
	const n = $derived(data.post);
</script>

<svelte:head>
	<title>{n.title} · Noticias · Nou Art</title>
	<meta name="description" content={n.summary || n.title} />
	<meta property="og:title" content="{n.title} · Nou Art" />
	<meta property="og:description" content={n.summary || 'Novedades de Nou Art.'} />
	<meta property="og:type" content="article" />
	{#if n.image}<meta property="og:image" content="{page.url.origin}/uploads/{n.image}" />{/if}
</svelte:head>

<div class="wrap page">
	<a href="/news" class="back muted">← Noticias</a>

	<article>
		{#if n.date}<p class="eyebrow">{formatEventDate(n.date)}</p>{/if}
		<h1>{n.title}</h1>

		{#if n.image}
			<div class="hero"><img src="/uploads/{n.image}" alt={n.title} /></div>
		{/if}

		{#if n.summary}<p class="lead">{n.summary}</p>{/if}
		{#if n.body}
			<div class="body">
				{#each n.body.split('\n') as para}
					{#if para.trim()}<p>{para}</p>{/if}
				{/each}
			</div>
		{/if}

		<div class="cta">
			<p class="muted">Sigue lo que hacemos en la asociación.</p>
			<div class="cta-row">
				<a href="/agenda" class="btn btn-primary">Ver la agenda</a>
				<a href="/news" class="btn">Más noticias</a>
			</div>
		</div>
	</article>
</div>

<style>
	.page { padding: 2.5rem 0 4rem; }
	.back { display: inline-block; margin-bottom: 1.2rem; font-size: 0.9rem; }
	article { max-width: 760px; }
	.eyebrow { text-transform: capitalize; letter-spacing: 0.02em; font-size: 0.9rem; }
	h1 { margin: 0.2rem 0 1rem; }
	.hero { border-radius: var(--radius); overflow: hidden; margin: 0.5rem 0 1.8rem; border: 1px solid var(--line); }
	.hero img { width: 100%; max-height: 460px; object-fit: cover; display: block; }
	.lead { font-size: 1.2rem; line-height: 1.55; }
	.body { margin-top: 1rem; }
	.body p { line-height: 1.7; }
	.cta { margin-top: 2.5rem; padding-top: 1.8rem; border-top: 1px solid var(--line); }
	.cta p { margin-bottom: 0.8rem; }
	.cta-row { display: flex; gap: 0.7rem; flex-wrap: wrap; }
</style>
