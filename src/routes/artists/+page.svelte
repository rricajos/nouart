<script lang="ts">
	let { data } = $props();
</script>

<svelte:head>
	<title>Artistas — Nou Art</title>
	<meta name="description" content="Los artistas de Nou Art, asociación de Nou Barris." />
</svelte:head>

<div class="wrap page">
	<header class="page-head">
		<p class="eyebrow">El colectivo</p>
		<h1>Artistas</h1>
	</header>

	<div class="artist-grid">
		{#each data.artists as a (a.id)}
			<a class="artist-card" href="/artist/{a.slug}">
				<div class="photo">
					{#if a.photo}<img src="/uploads/{a.photo}" alt={a.name} loading="lazy" />{/if}
				</div>
				<div class="info">
					<h2>{a.name}</h2>
					<div class="chip">{a.discipline}</div>
					<p class="muted bio">{a.bio}</p>
					<div class="muted count">{a.works} {a.works === 1 ? 'obra' : 'obras'}</div>
				</div>
			</a>
		{/each}
	</div>
</div>

<style>
	.page { padding: 2.5rem 0; }
	.page-head { margin-bottom: 1.8rem; }
	.artist-grid { display: grid; gap: 1.4rem; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); }
	.artist-card {
		display: flex; gap: 1rem; padding: 1rem; border: 1px solid var(--line);
		border-radius: var(--radius); background: var(--surface); box-shadow: var(--shadow);
		transition: transform 0.15s, border-color 0.15s;
	}
	.artist-card:hover { transform: translateY(-2px); border-color: var(--accent); }
	.photo { width: 96px; height: 96px; border-radius: 12px; overflow: hidden; background: var(--surface-2); flex: none; }
	.photo img { width: 100%; height: 100%; object-fit: cover; }
	.info h2 { font-size: 1.25rem; margin: 0 0 0.35rem; }
	.bio { font-size: 0.92rem; margin: 0.5rem 0 0.4rem; display: -webkit-box; -webkit-line-clamp: 3; line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
	.count { font-size: 0.85rem; }
</style>
