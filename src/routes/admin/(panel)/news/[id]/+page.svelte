<script lang="ts">
	import NewsForm from '$lib/components/NewsForm.svelte';
	let { data, form } = $props();
</script>

<svelte:head><title>Editar noticia · Gestión</title></svelte:head>

<a href="/admin/news" class="muted back">← Noticias</a>
<div class="head">
	<h1>Editar noticia</h1>
	{#if data.post.published}<a href="/news/{data.post.slug}" target="_blank" class="muted small">Ver en la web ↗</a>{/if}
</div>
<NewsForm post={data.post} {form} submitLabel="Guardar cambios" />

<style>
	.back { display: inline-block; margin-bottom: 0.8rem; font-size: 0.9rem; }
	.head { display: flex; align-items: baseline; justify-content: space-between; gap: 1rem; margin-bottom: 1.4rem; }
	.small { font-size: 0.85rem; }
</style>
