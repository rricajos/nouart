<script lang="ts">
	import ArtworkForm from '$lib/components/ArtworkForm.svelte';
	let { data, form } = $props();
</script>

<svelte:head><title>Editar {data.artwork.title} · Gestión</title></svelte:head>

<a href="/admin/works" class="muted back">← Obras</a>
<div class="head">
	<h1>Editar obra</h1>
	<a href="/work/{data.artwork.slug}" target="_blank" class="muted small">Ver en la web ↗</a>
</div>
<ArtworkForm artwork={data.artwork} artists={data.artists} {form} />

<div class="danger-zone">
	<form method="POST" action="?/delete" onsubmit={(e) => { if (!confirm('¿Eliminar esta obra? No se puede deshacer.')) e.preventDefault(); }}>
		<button class="btn del">Eliminar obra</button>
	</form>
</div>

<style>
	.back { display: inline-block; margin-bottom: 0.5rem; font-size: 0.9rem; }
	.back:hover { color: var(--accent); }
	.head { display: flex; align-items: baseline; gap: 1rem; }
	.small { font-size: 0.9rem; }
	.danger-zone { margin-top: 2.5rem; padding-top: 1.5rem; border-top: 1px solid var(--line); max-width: 640px; }
	.del { border-color: #c0392b; color: #c0392b; }
	.del:hover { background: #c0392b; color: #fff; }
</style>
