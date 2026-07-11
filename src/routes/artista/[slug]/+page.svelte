<script lang="ts">
	import ArtworkCard from '$lib/components/ArtworkCard.svelte';
	let { data } = $props();
	const a = $derived(data.artist);
</script>

<svelte:head>
	<title>{a.name} — Nou Art</title>
	<meta name="description" content={a.bio.slice(0, 155)} />
</svelte:head>

<div class="wrap page">
	<a href="/artistas" class="back muted">← Todos los artistas</a>

	<header class="profile">
		<div class="photo">
			{#if a.photo}<img src="/uploads/{a.photo}" alt={a.name} />{/if}
		</div>
		<div>
			<p class="eyebrow">{a.discipline}</p>
			<h1>{a.name}</h1>
			<p class="bio">{a.bio}</p>
			<div class="links">
				{#if a.website}<a class="btn" href={a.website} target="_blank" rel="noopener">Web</a>{/if}
				{#if a.instagram}
					<a class="btn" href="https://instagram.com/{a.instagram}" target="_blank" rel="noopener">
						Instagram
					</a>
				{/if}
			</div>
		</div>
	</header>

	<section>
		<h2 class="section-title">Obra</h2>
		{#if data.artworks.length}
			<div class="grid">
				{#each data.artworks as artwork (artwork.id)}
					<ArtworkCard {artwork} />
				{/each}
			</div>
		{:else}
			<p class="muted">Este artista todavía no tiene obra publicada.</p>
		{/if}
	</section>
</div>

<style>
	.page { padding: 1.8rem 0 2.5rem; }
	.back { display: inline-block; margin-bottom: 1.5rem; font-size: 0.95rem; }
	.back:hover { color: var(--accent); }
	.profile { display: flex; gap: 1.8rem; align-items: flex-start; margin-bottom: 2.5rem; flex-wrap: wrap; }
	.photo { width: 180px; height: 180px; border-radius: 16px; overflow: hidden; background: var(--surface-2); flex: none; box-shadow: var(--shadow); }
	.photo img { width: 100%; height: 100%; object-fit: cover; }
	.profile > div:last-child { flex: 1; min-width: 260px; }
	.bio { max-width: 62ch; font-size: 1.05rem; }
	.links { display: flex; gap: 0.6rem; margin-top: 1rem; }
	.section-title { border-top: 1px solid var(--line); padding-top: 1.6rem; margin-bottom: 1.3rem; }
</style>
