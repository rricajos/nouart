<script lang="ts">
	import StudioArtworkForm from '$lib/components/StudioArtworkForm.svelte';
	let { form } = $props();
</script>

<svelte:head>
	<title>Nueva obra · Mi estudio</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="wrap page">
	<a href="/studio" class="back muted">← Mi estudio</a>
	<h1>Nueva obra</h1>
	<StudioArtworkForm {form} submitLabel="Crear obra" />
</div>

<style>
	.page { padding: 2.5rem 0 4rem; max-width: 820px; }
	.back { display: inline-block; margin-bottom: 1rem; font-size: 0.9rem; }
	h1 { margin-bottom: 1.4rem; }
</style>
