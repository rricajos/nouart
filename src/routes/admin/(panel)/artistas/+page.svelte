<script lang="ts">
	import { enhance } from '$app/forms';
	let { data } = $props();
</script>

<svelte:head><title>Artistas · Gestión</title></svelte:head>

<header class="head">
	<h1>Artistas</h1>
	<a href="/admin/artistas/nuevo" class="btn btn-primary">+ Nuevo artista</a>
</header>

{#if data.artists.length}
	<table>
		<thead><tr><th></th><th>Nombre</th><th>Disciplina</th><th>Obras</th><th></th></tr></thead>
		<tbody>
			{#each data.artists as a (a.id)}
				<tr>
					<td class="thumb">{#if a.photo}<img src="/uploads/{a.photo}" alt="" />{/if}</td>
					<td><a href="/admin/artistas/{a.id}"><strong>{a.name}</strong></a></td>
					<td class="muted">{a.discipline}</td>
					<td>{a.works}</td>
					<td class="row-actions">
						<a href="/admin/artistas/{a.id}" class="mini">Editar</a>
						<form method="POST" action="?/delete" use:enhance={() => {
							return async ({ update }) => update();
						}} onsubmit={(e) => { if (!confirm(`¿Eliminar a ${a.name} y todas sus obras?`)) e.preventDefault(); }}>
							<input type="hidden" name="id" value={a.id} />
							<button class="mini danger">Eliminar</button>
						</form>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
{:else}
	<p class="muted">Todavía no hay artistas. <a href="/admin/artistas/nuevo">Crea el primero</a>.</p>
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
	form { margin: 0; }
</style>
