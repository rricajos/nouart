<script lang="ts">
	import { page } from '$app/state';
	let { data, children } = $props();

	const links = $derived([
		{ href: '/admin', label: 'Resumen', exact: true },
		{ href: '/admin/artistas', label: 'Artistas' },
		{ href: '/admin/obras', label: 'Obras' },
		{ href: '/admin/comentarios', label: 'Comentarios', badge: data.pendingComments },
		{ href: '/admin/mensajes', label: 'Mensajes', badge: data.unreadMessages }
	]);
	const path = $derived(page.url.pathname);
</script>

<svelte:head><meta name="robots" content="noindex" /></svelte:head>

<div class="admin">
	<aside class="side">
		<a href="/admin" class="brand"><span class="mark">◆</span> Nou Art</a>
		<nav>
			{#each links as l (l.href)}
				<a
					href={l.href}
					class="item"
					class:active={l.exact ? path === l.href : path.startsWith(l.href)}
				>
					<span>{l.label}</span>
					{#if l.badge}<span class="badge">{l.badge}</span>{/if}
				</a>
			{/each}
		</nav>
		<div class="side-foot">
			<a href="/" class="muted small" target="_blank">Ver el sitio ↗</a>
			<form method="POST" action="/admin/login?/logout">
				<button class="logout">Salir</button>
			</form>
		</div>
	</aside>

	<div class="content">
		{@render children()}
	</div>
</div>

<style>
	.admin { display: grid; grid-template-columns: 230px 1fr; min-height: 100vh; }
	.side { background: var(--surface); border-right: 1px solid var(--line); padding: 1.2rem; display: flex; flex-direction: column; position: sticky; top: 0; height: 100vh; }
	.brand { font-family: var(--serif); font-size: 1.25rem; margin-bottom: 1.5rem; }
	.mark { color: var(--accent); }
	nav { display: flex; flex-direction: column; gap: 0.15rem; }
	.item { display: flex; align-items: center; justify-content: space-between; padding: 0.55rem 0.8rem; border-radius: 8px; color: var(--muted); font-size: 0.96rem; }
	.item:hover { background: var(--surface-2); color: var(--text); }
	.item.active { background: var(--accent-soft); color: var(--text); font-weight: 600; }
	.badge { background: var(--accent); color: #fff; font-size: 0.72rem; font-weight: 700; padding: 0.05rem 0.45rem; border-radius: 999px; }
	.side-foot { margin-top: auto; display: flex; flex-direction: column; gap: 0.8rem; padding-top: 1rem; }
	.small { font-size: 0.85rem; }
	.logout { font: inherit; font-size: 0.9rem; color: var(--muted); background: none; border: 1px solid var(--line); border-radius: 8px; padding: 0.4rem 0.8rem; cursor: pointer; width: 100%; }
	.logout:hover { border-color: var(--accent); color: var(--text); }
	.content { padding: 2rem; max-width: 1000px; }
	@media (max-width: 720px) {
		.admin { grid-template-columns: 1fr; }
		.side { position: static; height: auto; flex-direction: row; flex-wrap: wrap; align-items: center; gap: 0.5rem; }
		.side .brand { margin: 0 1rem 0 0; }
		nav { flex-direction: row; flex-wrap: wrap; }
		.side-foot { margin: 0 0 0 auto; flex-direction: row; }
		.content { padding: 1.2rem; }
	}
</style>
