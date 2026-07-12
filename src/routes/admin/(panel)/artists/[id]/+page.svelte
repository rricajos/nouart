<script lang="ts">
	import ArtistForm from '$lib/components/ArtistForm.svelte';
	let { data, form } = $props();
</script>

<svelte:head><title>Editar {data.artist.name} · Gestión</title></svelte:head>

<a href="/admin/artists" class="muted back">← Artistas</a>
<h1>Editar artista</h1>
<ArtistForm artist={data.artist} {form} />

<div class="danger-zone">
	<form method="POST" action="?/delete" onsubmit={(e) => { if (!confirm('¿Eliminar este artista y todas sus obras? No se puede deshacer.')) e.preventDefault(); }}>
		<button class="btn del">Eliminar artista</button>
	</form>
</div>

<style>
	.back { display: inline-block; margin-bottom: 0.5rem; font-size: 0.9rem; }
	.back:hover { color: var(--accent); }
	.danger-zone { margin-top: 2.5rem; padding-top: 1.5rem; border-top: 1px solid var(--line); max-width: 620px; }
	.del { border-color: #c0392b; color: #c0392b; }
	.del:hover { background: #c0392b; color: #fff; }
</style>
