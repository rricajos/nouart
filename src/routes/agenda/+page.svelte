<script lang="ts">
	import { calendarBadge } from '$lib/date';
	import type { Event } from '$lib/server/db';
	let { data } = $props();
</script>

<svelte:head>
	<title>Agenda · Nou Art</title>
	<meta name="description" content="Talleres, eventos y exposiciones de Nou Art, asociación cultural de Nou Barris." />
	<meta property="og:title" content="Agenda · Nou Art" />
	<meta property="og:description" content="Talleres, eventos y exposiciones en Nou Barris." />
</svelte:head>

{#snippet eventCard(e: Event)}
	{@const b = calendarBadge(e.date)}
	<a class="ev" href="/agenda/{e.slug}">
		<div class="ev-media">
			{#if e.image}
				<img src="/uploads/{e.image}" alt="" loading="lazy" />
			{:else}
				<div class="cal">
					{#if b}<span class="cal-day">{b.day}</span><span class="cal-mon">{b.month}</span>
					{:else}<span class="cal-mon">Fecha<br />abierta</span>{/if}
				</div>
			{/if}
		</div>
		<div class="ev-body">
			<div class="ev-meta">
				<span class="date">{b ? `${b.day} ${b.month}` : 'Por confirmar'}{#if e.time} · {e.time}{/if}</span>
				{#if e.location}<span class="loc muted">· {e.location}</span>{/if}
			</div>
			<h3>{e.title}</h3>
			{#if e.summary}<p class="muted">{e.summary}</p>{/if}
		</div>
	</a>
{/snippet}

<div class="wrap page">
	<p class="eyebrow">Agenda</p>
	<h1>Talleres, eventos y exposiciones</h1>
	<p class="lead muted">Las actividades de Nou Art para crear, compartir y hacer comunidad en Nou Barris.</p>

	{#if data.upcoming.length}
		<section>
			<h2 class="sec">Próximas</h2>
			<div class="ev-list">
				{#each data.upcoming as e (e.id)}{@render eventCard(e)}{/each}
			</div>
		</section>
	{/if}

	{#if data.past.length}
		<section class="past">
			<h2 class="sec">Anteriores</h2>
			<div class="ev-list">
				{#each data.past as e (e.id)}{@render eventCard(e)}{/each}
			</div>
		</section>
	{/if}

	{#if !data.upcoming.length && !data.past.length}
		<p class="empty muted">Pronto publicaremos nuestras próximas actividades. ¡Vuelve pronto!</p>
	{/if}
</div>

<style>
	.page { padding: 2.5rem 0 4rem; }
	h1 { margin-bottom: 0.4rem; }
	.lead { font-size: 1.15rem; max-width: 60ch; margin-bottom: 2.5rem; }
	.sec { font-size: 1.3rem; margin: 0 0 1.2rem; padding-bottom: 0.5rem; border-bottom: 1px solid var(--line); }
	.past { margin-top: 3rem; }
	.ev-list { display: grid; gap: 1.3rem; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); }
	.ev { display: flex; flex-direction: column; background: var(--surface); border: 1px solid var(--line); border-radius: var(--radius); overflow: hidden; box-shadow: var(--shadow); transition: transform 0.18s, box-shadow 0.18s; }
	.ev:hover { transform: translateY(-3px); box-shadow: 0 12px 34px rgba(0,0,0,.14); }
	.ev-media { aspect-ratio: 16 / 9; background: var(--surface-2); overflow: hidden; }
	.ev-media img { width: 100%; height: 100%; object-fit: cover; }
	.cal { width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; background: linear-gradient(135deg, var(--accent-soft), var(--surface-2)); color: var(--accent); }
	.cal-day { font-family: var(--serif); font-size: 2.6rem; font-weight: 700; line-height: 1; }
	.cal-mon { text-transform: uppercase; letter-spacing: 0.12em; font-size: 0.85rem; font-weight: 600; text-align: center; }
	.ev-body { padding: 1rem 1.1rem 1.2rem; }
	.ev-meta { font-size: 0.85rem; margin-bottom: 0.35rem; }
	.ev-meta .date { color: var(--accent); font-weight: 600; }
	.ev-body h3 { font-family: var(--serif); font-size: 1.25rem; margin: 0 0 0.35rem; }
	.ev-body p { font-size: 0.95rem; margin: 0; display: -webkit-box; -webkit-line-clamp: 2; line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
	.past .ev { opacity: 0.9; }
	.empty { font-size: 1.1rem; padding: 2rem 0; }
</style>
