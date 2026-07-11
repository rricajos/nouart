<script lang="ts">
	import ArtistForm from '$lib/components/ArtistForm.svelte';
	let { form } = $props();
</script>

<svelte:head><title>Nuevo artista · Gestión</title></svelte:head>

<a href="/admin/artistas" class="muted back">← Artistas</a>
<h1>Nuevo artista</h1>
<ArtistForm {form} />

<style>
	.back { display: inline-block; margin-bottom: 0.5rem; font-size: 0.9rem; }
	.back:hover { color: var(--accent); }
</style>
