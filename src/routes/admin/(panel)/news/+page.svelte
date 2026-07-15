<script lang="ts">
	import { enhance } from '$app/forms';
	import { calendarBadge } from '$lib/date';
	let { data } = $props();
</script>

<svelte:head><title>Noticias · Gestión</title></svelte:head>

<header class="head">
	<h1>Noticias</h1>
	<a href="/admin/news/new" class="btn btn-primary">+ Nueva noticia</a>
</header>

{#if data.news.length}
	<table>
		<thead><tr><th></th><th>Título</th><th>Fecha</th><th>Estado</th><th></th></tr></thead>
		<tbody>
			{#each data.news as n (n.id)}
				{@const b = calendarBadge(n.date)}
				<tr>
					<td class="thumb">{#if n.image}<img src="/uploads/{n.image}" alt="" />{/if}</td>
					<td><a href="/admin/news/{n.id}"><strong>{n.title}</strong></a></td>
					<td class="muted">{b ? `${b.day} ${b.month}` : '—'}</td>
					<td>
						<form method="POST" action="?/togglePublish" use:enhance={() => ({ update }) => update()}>
							<input type="hidden" name="id" value={n.id} />
							<button class="pill {n.published ? 'on' : 'off'}">{n.published ? 'Publicada' : 'Oculta'}</button>
						</form>
					</td>
					<td class="row-actions">
						<a href="/admin/news/{n.id}" class="mini">Editar</a>
						<form method="POST" action="?/delete" use:enhance={() => ({ update }) => update()}
							onsubmit={(e) => { if (!confirm(`¿Eliminar "${n.title}"?`)) e.preventDefault(); }}>
							<input type="hidden" name="id" value={n.id} />
							<button class="mini danger">Eliminar</button>
						</form>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
{:else}
	<p class="muted">Todavía no hay noticias. <a href="/admin/news/new">Publica la primera</a>.</p>
{/if}

<style>
	.head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem; }
	.head h1 { margin: 0; }
	table { width: 100%; border-collapse: collapse; }
	th { text-align: left; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--muted); padding: 0.5rem 0.6rem; border-bottom: 1px solid var(--line); }
	td { padding: 0.6rem; border-bottom: 1px solid var(--line); vertical-align: middle; }
	.thumb { width: 60px; }
	.thumb img { width: 52px; height: 32px; object-fit: cover; border-radius: 6px; }
	/* Celda normal (NO flex, o rompe la alineación de la tabla); botones inline a la derecha. */
	.row-actions { text-align: right; white-space: nowrap; }
	.row-actions > a, .row-actions > form { display: inline-flex; vertical-align: middle; }
	.row-actions > form { margin-left: 0.5rem; }
	.mini { font-size: 0.85rem; padding: 0.3rem 0.6rem; border-radius: 6px; border: 1px solid var(--line); background: var(--surface); color: var(--text); cursor: pointer; font-family: inherit; }
	.mini:hover { border-color: var(--accent); }
	.danger:hover { border-color: #c0392b; color: #c0392b; }
	.pill { font: inherit; font-size: 0.78rem; padding: 0.2rem 0.6rem; border-radius: 999px; cursor: pointer; border: 1px solid var(--line); }
	.pill.on { background: var(--accent-soft); color: var(--text); border-color: var(--accent); }
	.pill.off { background: var(--surface-2); color: var(--muted); }
	form { margin: 0; }
</style>
