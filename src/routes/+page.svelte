<script lang="ts">
	import ArtworkCard from '$lib/components/ArtworkCard.svelte';
	import Testimonials from '$lib/components/Testimonials.svelte';
	import { calendarBadge, formatEventDate } from '$lib/date';
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
			<a href="/gallery" class="btn btn-primary">Ver la galería</a>
			<a href="/join" class="btn">Hazte socio</a>
		</div>
	</div>
</section>

{#if data.upcoming.length}
	<section class="wrap block">
		<div class="block-head">
			<h2>Próximas actividades</h2>
			<a href="/agenda" class="muted see-all">Ver la agenda →</a>
		</div>
		<div class="agenda-row">
			{#each data.upcoming as e (e.id)}
				{@const b = calendarBadge(e.date)}
				<a class="ev" href="/agenda/{e.slug}">
					<span class="ev-date">
						{#if b}<span class="d">{b.day}</span><span class="m">{b.month}</span>
						{:else}<span class="m">Próx.</span>{/if}
					</span>
					<span class="ev-info">
						<strong>{e.title}</strong>
						<span class="muted meta">{#if e.time}{e.time}{/if}{#if e.time && e.location} · {/if}{e.location}</span>
					</span>
				</a>
			{/each}
		</div>
	</section>
{/if}

{#if data.latestNews.length}
	<section class="wrap block">
		<div class="block-head">
			<h2>Últimas noticias</h2>
			<a href="/news" class="muted see-all">Ver todas →</a>
		</div>
		<div class="news-row">
			{#each data.latestNews as n (n.id)}
				<a class="np" href="/news/{n.slug}">
					{#if n.image}<span class="np-thumb"><img src="/uploads/{n.image}" alt="" loading="lazy" /></span>{/if}
					<span class="np-body">
						{#if n.date}<span class="np-date">{formatEventDate(n.date)}</span>{/if}
						<strong>{n.title}</strong>
						{#if n.summary}<span class="muted np-sum">{n.summary}</span>{/if}
					</span>
				</a>
			{/each}
		</div>
	</section>
{/if}

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
		<a href="/gallery" class="muted see-all">Ver las {data.total} obras →</a>
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
				<a class="artist-pill" href="/artist/{a.slug}">
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
		<a href="/contact" class="btn btn-primary">Contacta con nosotros</a>
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
	.agenda-row { display: grid; gap: 0.9rem; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); }
	.ev { display: flex; align-items: center; gap: 1rem; padding: 0.8rem 1rem; border: 1px solid var(--line); border-radius: var(--radius); background: var(--surface); box-shadow: var(--shadow); transition: border-color 0.15s, transform 0.15s; }
	.ev:hover { border-color: var(--accent); transform: translateY(-2px); }
	.ev-date { flex: none; width: 54px; height: 54px; border-radius: 10px; background: var(--accent-soft); color: var(--accent); display: flex; flex-direction: column; align-items: center; justify-content: center; line-height: 1; }
	.ev-date .d { font-family: var(--serif); font-size: 1.5rem; font-weight: 700; }
	.ev-date .m { text-transform: uppercase; font-size: 0.72rem; font-weight: 600; letter-spacing: 0.06em; }
	.ev-info { min-width: 0; display: flex; flex-direction: column; gap: 0.15rem; }
	.ev-info strong { font-family: var(--serif); font-size: 1.1rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
	.ev-info .meta { font-size: 0.85rem; }
	.news-row { display: grid; gap: 1.2rem; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); }
	.np { display: flex; flex-direction: column; background: var(--surface); border: 1px solid var(--line); border-radius: var(--radius); overflow: hidden; box-shadow: var(--shadow); transition: transform 0.18s, box-shadow 0.18s; }
	.np:hover { transform: translateY(-3px); box-shadow: 0 12px 34px rgba(0,0,0,.14); }
	.np-thumb { aspect-ratio: 16 / 9; background: var(--surface-2); overflow: hidden; }
	.np-thumb img { width: 100%; height: 100%; object-fit: cover; }
	.np-body { padding: 0.9rem 1.1rem 1.1rem; display: flex; flex-direction: column; gap: 0.25rem; }
	.np-date { font-size: 0.78rem; color: var(--accent); font-weight: 600; text-transform: capitalize; }
	.np-body strong { font-family: var(--serif); font-size: 1.15rem; line-height: 1.25; }
	.np-sum { font-size: 0.9rem; display: -webkit-box; -webkit-line-clamp: 2; line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
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
