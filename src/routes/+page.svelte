<script lang="ts">
	import ArtworkCard from '$lib/components/ArtworkCard.svelte';
	import Testimonials from '$lib/components/Testimonials.svelte';
	import { site, services } from '$lib/content';
	let { data } = $props();
</script>

<svelte:head>
	<title>Nou Art — {site.tagline}</title>
	<meta
		name="description"
		content="Nou Art, asociación cultural de Nou Barris. Talleres, eventos, exposiciones y la obra de sus artistas, en abierto."
	/>
</svelte:head>

<section class="hero">
	<div class="wrap">
		<p class="eyebrow">Asociación cultural · Nou Barris, Barcelona</p>
		<h1>{site.tagline}</h1>
		<p class="lede muted">{site.heroLead}</p>
		<div class="hero-cta">
			<a href="/galeria" class="btn btn-primary">Ver la galería</a>
			<a href="/contacto" class="btn">Únete / contacta</a>
		</div>
	</div>
</section>

<section class="wrap block">
	<div class="block-head"><h2>Qué hacemos</h2></div>
	<div class="services">
		{#each services as s (s.title)}
			<article class="service">
				<h3>{s.title}</h3>
				<p class="muted">{s.body}</p>
			</article>
		{/each}
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
		<p class="muted">Pronto publicaremos aquí la obra de nuestros artistas.</p>
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

<section class="wrap block">
	<div class="block-head"><h2>Lo que dicen</h2></div>
	<Testimonials />
</section>

<section class="promo">
	<div class="wrap promo-inner">
		<div>
			<h2>{site.promoTitle}</h2>
			<p class="muted">{site.promoLead}</p>
		</div>
		<a href="/contacto" class="btn btn-primary">Contacta con nosotros</a>
	</div>
</section>

<style>
	.hero { padding: 4rem 0 2.5rem; }
	.hero h1 { margin-bottom: 0.6rem; max-width: 16ch; }
	.lede { font-size: 1.2rem; max-width: 44ch; }
	.hero-cta { display: flex; flex-wrap: wrap; gap: 0.75rem; margin-top: 1.5rem; }
	.block { padding: 2rem 0; }
	.block-head { display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 1.3rem; }
	.see-all { font-size: 0.95rem; white-space: nowrap; }
	.see-all:hover { color: var(--accent); }
	.services { display: grid; gap: 1.4rem; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); }
	.service {
		padding: 1.6rem; background: var(--surface); border: 1px solid var(--line);
		border-radius: var(--radius); box-shadow: var(--shadow); position: relative;
	}
	.service::before {
		content: ''; display: block; width: 34px; height: 3px; background: var(--accent);
		border-radius: 2px; margin-bottom: 1rem;
	}
	.service h3 { font-size: 1.2rem; margin-bottom: 0.5rem; }
	.artists-row { display: grid; gap: 0.9rem; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); }
	.artist-pill {
		display: flex; align-items: center; gap: 0.8rem; padding: 0.7rem 0.9rem;
		border: 1px solid var(--line); border-radius: var(--radius); background: var(--surface);
		transition: border-color 0.15s, transform 0.15s;
	}
	.artist-pill:hover { border-color: var(--accent); transform: translateY(-2px); }
	.avatar { width: 46px; height: 46px; border-radius: 999px; overflow: hidden; background: var(--surface-2); flex: none; }
	.avatar img { width: 100%; height: 100%; object-fit: cover; }
	.promo { margin-top: 2rem; background: var(--surface); border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); padding: 2.5rem 0; }
	.promo-inner { display: flex; align-items: center; justify-content: space-between; gap: 1.5rem; flex-wrap: wrap; }
	.promo-inner h2 { margin-bottom: 0.3rem; }
</style>
