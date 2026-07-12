<script lang="ts">
	import ArtworkForm from '$lib/components/ArtworkForm.svelte';
	let { data, form } = $props();
</script>

<svelte:head><title>Nueva obra · Gestión</title></svelte:head>

<a href="/admin/works" class="muted back">← Obras</a>
<h1>Nueva obra</h1>
{#if data.artists.length}
	<ArtworkForm artists={data.artists} {form} />
{:else}
	<p class="muted">Primero crea un artista. <a href="/admin/artists/new">Crear artista</a>.</p>
{/if}

<style>
	.back { display: inline-block; margin-bottom: 0.5rem; font-size: 0.9rem; }
	.back:hover { color: var(--accent); }
</style>
