<script lang="ts">
	import { enhance } from '$app/forms';
	import StudioArtworkForm from '$lib/components/StudioArtworkForm.svelte';
	let { data, form } = $props();
</script>

<svelte:head>
	<title>Editar obra · Mi estudio</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="wrap page">
	<a href="/studio" class="back muted">← Mi estudio</a>
	<div class="head">
		<h1>Editar obra</h1>
		<a href="/work/{data.artwork.slug}" target="_blank" class="muted small">Ver en la web ↗</a>
	</div>

	<StudioArtworkForm artwork={data.artwork} {form} action="?/save" submitLabel="Guardar cambios" />

	<form
		class="danger-zone"
		method="POST"
		action="?/delete"
		use:enhance
		onsubmit={(e) => {
			if (!confirm('¿Eliminar esta obra? No se puede deshacer.')) e.preventDefault();
		}}
	>
		<button class="del">Eliminar obra</button>
	</form>
</div>

<style>
	.page { padding: 2.5rem 0 4rem; max-width: 820px; }
	.back { display: inline-block; margin-bottom: 1rem; font-size: 0.9rem; }
	.head { display: flex; align-items: baseline; justify-content: space-between; gap: 1rem; margin-bottom: 1.4rem; }
	.small { font-size: 0.85rem; }
	.danger-zone { margin-top: 2rem; padding-top: 1.5rem; border-top: 1px solid var(--line); max-width: 640px; }
	.del { font: inherit; font-size: 0.9rem; color: #c0392b; background: none; border: 1px solid #e2b8b2; border-radius: 8px; padding: 0.5rem 1rem; cursor: pointer; }
	.del:hover { background: #fbeceb; }
	@media (prefers-color-scheme: dark) { .del { border-color: #6b342d; } .del:hover { background: #351512; } }
</style>
