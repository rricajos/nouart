<script lang="ts">
	let { data } = $props();
	const s = $derived(data.stats);
	const tiles = $derived([
		{ label: 'Artistas', value: s.artists, href: '/admin/artistas' },
		{ label: 'Obras', value: s.artworks, href: '/admin/obras', sub: `${s.published} publicadas` },
		{ label: 'Me gusta', value: s.likes },
		{ label: 'Comentarios por revisar', value: s.pendingComments, href: '/admin/comentarios', warn: s.pendingComments > 0 },
		{ label: 'Mensajes sin leer', value: s.unreadMessages, href: '/admin/mensajes', warn: s.unreadMessages > 0 }
	]);
</script>

<svelte:head><title>Gestión — Nou Art</title></svelte:head>

<header class="head">
	<h1>Resumen</h1>
	<div class="quick">
		<a href="/admin/artistas/nuevo" class="btn">+ Artista</a>
		<a href="/admin/obras/nuevo" class="btn btn-primary">+ Obra</a>
	</div>
</header>

<div class="tiles">
	{#each tiles as t (t.label)}
		<svelte:element this={t.href ? 'a' : 'div'} href={t.href} class="tile" class:warn={t.warn}>
			<div class="value">{t.value}</div>
			<div class="label">{t.label}</div>
			{#if t.sub}<div class="muted sub">{t.sub}</div>{/if}
		</svelte:element>
	{/each}
</div>

<section class="recent">
	<h2>Últimos mensajes</h2>
	{#if data.recentMessages.length}
		<ul>
			{#each data.recentMessages as m (m.id)}
				<li>
					<div><strong>{m.name}</strong> <span class="muted">· {m.artist_name ?? 'General'}</span></div>
					<p class="muted body">{m.body}</p>
					<span class="muted date">{m.created_at.slice(0, 16).replace('T', ' ')}</span>
				</li>
			{/each}
		</ul>
		<a href="/admin/mensajes" class="muted">Ver todos →</a>
	{:else}
		<p class="muted">Aún no hay mensajes.</p>
	{/if}
</section>

<style>
	.head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.6rem; gap: 1rem; flex-wrap: wrap; }
	.head h1 { margin: 0; }
	.quick { display: flex; gap: 0.6rem; }
	.tiles { display: grid; gap: 1rem; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); margin-bottom: 2.5rem; }
	.tile { background: var(--surface); border: 1px solid var(--line); border-radius: var(--radius); padding: 1.2rem; box-shadow: var(--shadow); }
	a.tile { transition: border-color 0.15s, transform 0.15s; }
	a.tile:hover { border-color: var(--accent); transform: translateY(-2px); }
	.tile.warn { border-color: var(--accent); background: var(--accent-soft); }
	.value { font-family: var(--serif); font-size: 2.2rem; line-height: 1; }
	.label { color: var(--muted); margin-top: 0.3rem; font-size: 0.92rem; }
	.sub { font-size: 0.8rem; margin-top: 0.15rem; }
	.recent ul { list-style: none; padding: 0; margin: 0 0 1rem; display: flex; flex-direction: column; gap: 0.9rem; }
	.recent li { border: 1px solid var(--line); border-radius: var(--radius); padding: 0.8rem 1rem; background: var(--surface); }
	.recent .body { margin: 0.2rem 0; display: -webkit-box; -webkit-line-clamp: 2; line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
	.date { font-size: 0.8rem; }
</style>
