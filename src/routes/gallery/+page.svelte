<script lang="ts">
	import ArtworkCard from '$lib/components/ArtworkCard.svelte';
	let { data } = $props();
</script>

<svelte:head>
	<title>Galería — Nou Art</title>
	<meta name="description" content="Todas las obras de los artistas de Nou Art, colectivo de Nou Barris." />
</svelte:head>

<div class="wrap page">
	<header class="page-head">
		<p class="eyebrow">Colección</p>
		<h1>Galería</h1>
	</header>

	<nav class="filters" aria-label="Filtrar por artista">
		<a href="/gallery" class="filter" class:active={!data.artistFilter}>Todas</a>
		{#each data.artists as a (a.id)}
			<a href="/gallery?artist={a.slug}" class="filter" class:active={data.artistFilter === a.slug}>
				{a.name}
			</a>
		{/each}
	</nav>

	{#if data.artworks.length}
		<div class="grid">
			{#each data.artworks as artwork (artwork.id)}
				<ArtworkCard {artwork} />
			{/each}
		</div>
	{:else}
		<p class="muted">No hay obras para este filtro.</p>
	{/if}
</div>

<style>
	.page { padding: 2.5rem 0; }
	.page-head { margin-bottom: 1.5rem; }
	.filters { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 2rem; }
	.filter {
		padding: 0.4rem 0.9rem; border-radius: 999px; font-size: 0.92rem; color: var(--muted);
		border: 1px solid var(--line); background: var(--surface);
	}
	.filter:hover { border-color: var(--accent); color: var(--text); }
	.filter.active { background: var(--accent); color: #fff; border-color: var(--accent); }
</style>
