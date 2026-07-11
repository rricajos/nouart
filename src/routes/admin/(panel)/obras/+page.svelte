<script lang="ts">
	import { enhance } from '$app/forms';
	let { data } = $props();
</script>

<svelte:head><title>Obras · Gestión</title></svelte:head>

<header class="head">
	<h1>Obras</h1>
	<a href="/admin/obras/nuevo" class="btn btn-primary">+ Nueva obra</a>
</header>

{#if data.artworks.length}
	<table>
		<thead><tr><th></th><th>Título</th><th>Artista</th><th>Año</th><th>♥</th><th>Estado</th><th></th></tr></thead>
		<tbody>
			{#each data.artworks as w (w.id)}
				<tr>
					<td class="thumb">{#if w.image}<img src="/uploads/{w.image}" alt="" />{/if}</td>
					<td><a href="/admin/obras/{w.id}"><strong>{w.title}</strong></a></td>
					<td class="muted">{w.artist_name}</td>
					<td class="muted">{w.year}</td>
					<td>{w.likes}</td>
					<td>
						<form method="POST" action="?/togglePublish" use:enhance={() => ({ update }) => update()}>
							<input type="hidden" name="id" value={w.id} />
							<button class="pill {w.published ? 'on' : 'off'}">{w.published ? 'Publicada' : 'Oculta'}</button>
						</form>
					</td>
					<td class="row-actions">
						<a href="/admin/obras/{w.id}" class="mini">Editar</a>
						<form method="POST" action="?/delete" use:enhance={() => ({ update }) => update()}
							onsubmit={(e) => { if (!confirm(`¿Eliminar "${w.title}"?`)) e.preventDefault(); }}>
							<input type="hidden" name="id" value={w.id} />
							<button class="mini danger">Eliminar</button>
						</form>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
{:else}
	<p class="muted">Todavía no hay obras. <a href="/admin/obras/nuevo">Crea la primera</a>.</p>
{/if}

<style>
	.head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem; }
	.head h1 { margin: 0; }
	table { width: 100%; border-collapse: collapse; }
	th { text-align: left; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--muted); padding: 0.5rem 0.6rem; border-bottom: 1px solid var(--line); }
	td { padding: 0.6rem; border-bottom: 1px solid var(--line); vertical-align: middle; }
	.thumb { width: 48px; }
	.thumb img { width: 40px; height: 40px; object-fit: cover; border-radius: 8px; }
	.row-actions { display: flex; gap: 0.5rem; align-items: center; justify-content: flex-end; }
	.mini { font-size: 0.85rem; padding: 0.3rem 0.6rem; border-radius: 6px; border: 1px solid var(--line); background: var(--surface); color: var(--text); cursor: pointer; font-family: inherit; }
	.mini:hover { border-color: var(--accent); }
	.danger:hover { border-color: #c0392b; color: #c0392b; }
	.pill { font: inherit; font-size: 0.78rem; padding: 0.2rem 0.6rem; border-radius: 999px; cursor: pointer; border: 1px solid var(--line); }
	.pill.on { background: var(--accent-soft); color: var(--text); border-color: var(--accent); }
	.pill.off { background: var(--surface-2); color: var(--muted); }
	form { margin: 0; }
</style>
