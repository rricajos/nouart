<script lang="ts">
	import { formatEventDate } from '$lib/date';
	let { data } = $props();
</script>

<svelte:head>
	<title>Noticias · Nou Art</title>
	<meta name="description" content="Noticias, convocatorias y novedades de Nou Art, asociación cultural de Nou Barris." />
	<meta property="og:title" content="Noticias · Nou Art" />
	<meta property="og:description" content="Novedades y convocatorias de Nou Art." />
</svelte:head>

<div class="wrap page">
	<p class="eyebrow">Noticias</p>
	<h1>Novedades de la asociación</h1>
	<p class="lead muted">Convocatorias, resúmenes de actividades y todo lo que va pasando en Nou Art.</p>

	{#if data.news.length}
		<div class="list">
			{#each data.news as n (n.id)}
				<a class="post" href="/news/{n.slug}">
					{#if n.image}
						<span class="thumb"><img src="/uploads/{n.image}" alt="" loading="lazy" /></span>
					{/if}
					<span class="body">
						{#if n.date}<span class="date">{formatEventDate(n.date)}</span>{/if}
						<h2>{n.title}</h2>
						{#if n.summary}<p class="muted">{n.summary}</p>{/if}
						<span class="more">Leer más →</span>
					</span>
				</a>
			{/each}
		</div>
	{:else}
		<p class="empty muted">Todavía no hemos publicado noticias. ¡Vuelve pronto!</p>
	{/if}
</div>

<style>
	.page { padding: 2.5rem 0 4rem; max-width: 860px; }
	h1 { margin-bottom: 0.4rem; }
	.lead { font-size: 1.15rem; max-width: 60ch; margin-bottom: 2.5rem; }
	.list { display: flex; flex-direction: column; gap: 1.3rem; }
	.post { display: flex; gap: 1.3rem; background: var(--surface); border: 1px solid var(--line); border-radius: var(--radius); box-shadow: var(--shadow); padding: 1.2rem; transition: transform 0.18s, box-shadow 0.18s; }
	.post:hover { transform: translateY(-3px); box-shadow: 0 12px 34px rgba(0,0,0,.14); }
	.thumb { flex: none; width: 160px; aspect-ratio: 4 / 3; border-radius: 10px; overflow: hidden; background: var(--surface-2); }
	.thumb img { width: 100%; height: 100%; object-fit: cover; }
	.body { min-width: 0; display: flex; flex-direction: column; }
	.date { font-size: 0.82rem; color: var(--accent); font-weight: 600; text-transform: capitalize; }
	.post h2 { font-size: 1.3rem; margin: 0.2rem 0 0.4rem; }
	.post p { font-size: 0.96rem; margin: 0 0 0.6rem; }
	.more { font-size: 0.9rem; color: var(--muted); margin-top: auto; }
	.post:hover .more { color: var(--accent); }
	.empty { font-size: 1.1rem; padding: 2rem 0; }
	@media (max-width: 620px) {
		.post { flex-direction: column; gap: 0.9rem; }
		.thumb { width: 100%; aspect-ratio: 16 / 9; }
	}
</style>
