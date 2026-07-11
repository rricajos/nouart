<script lang="ts">
	import ArtworkCard from '$lib/components/ArtworkCard.svelte';
	let { data } = $props();
</script>

<svelte:head>
	<title>Nou Art — Arte de Nou Barris</title>
	<meta
		name="description"
		content="Nou Art es una asociación de artistas de Nou Barris. Descubre su obra, déjales tu opinión y ponte en contacto."
	/>
</svelte:head>

<section class="hero">
	<div class="wrap">
		<p class="eyebrow">Asociación de artistas · Nou Barris, Barcelona</p>
		<h1>El arte del barrio,<br />al alcance de todos.</h1>
		<p class="lede muted">
			Nou Art reúne a artistas de Nou Barris para mostrar su obra en abierto.
			Pintura, fotografía, ilustración y escultura hechas aquí, para todo el mundo.
		</p>
		<div class="hero-cta">
			<a href="/galeria" class="btn btn-primary">Ver la galería</a>
			<a href="/artistas" class="btn">Conoce a los artistas</a>
		</div>
	</div>
</section>

<section class="wrap block">
	<div class="block-head">
		<h2>Obras destacadas</h2>
		<a href="/galeria" class="muted see-all">Ver las {data.total} obras →</a>
	</div>
	{#if data.featured.length}
		<div class="grid">
			{#each data.featured as artwork (artwork.id)}
				<ArtworkCard {artwork} />
			{/each}
		</div>
	{:else}
		<p class="muted">Todavía no hay obras publicadas. Vuelve pronto.</p>
	{/if}
</section>

{#if data.artists.length}
	<section class="wrap block">
		<div class="block-head"><h2>Artistas</h2></div>
		<div class="artists-row">
			{#each data.artists as a (a.id)}
				<a class="artist-pill" href="/artista/{a.slug}">
					<span class="avatar">
						{#if a.photo}<img src="/uploads/{a.photo}" alt={a.name} />{/if}
					</span>
					<span>
						<strong>{a.name}</strong>
						<span class="muted" style="display:block;font-size:.85rem">{a.discipline}</span>
					</span>
				</a>
			{/each}
		</div>
	</section>
{/if}

<style>
	.hero { padding: 4rem 0 2.5rem; }
	.hero h1 { margin-bottom: 0.6rem; }
	.lede { font-size: 1.2rem; max-width: 40ch; }
	.hero-cta { display: flex; flex-wrap: wrap; gap: 0.75rem; margin-top: 1.5rem; }
	.block { padding: 2rem 0; }
	.block-head { display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 1.3rem; }
	.see-all { font-size: 0.95rem; white-space: nowrap; }
	.see-all:hover { color: var(--accent); }
	.artists-row { display: grid; gap: 0.9rem; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); }
	.artist-pill {
		display: flex; align-items: center; gap: 0.8rem; padding: 0.7rem 0.9rem;
		border: 1px solid var(--line); border-radius: var(--radius); background: var(--surface);
		transition: border-color 0.15s, transform 0.15s;
	}
	.artist-pill:hover { border-color: var(--accent); transform: translateY(-2px); }
	.avatar { width: 46px; height: 46px; border-radius: 999px; overflow: hidden; background: var(--surface-2); flex: none; }
	.avatar img { width: 100%; height: 100%; object-fit: cover; }
</style>
