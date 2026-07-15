<script lang="ts">
	import NewsForm from '$lib/components/NewsForm.svelte';
	let { form } = $props();
</script>

<svelte:head><title>Nueva noticia · Gestión</title></svelte:head>

<a href="/admin/news" class="muted back">← Noticias</a>
<h1>Nueva noticia</h1>
<NewsForm {form} submitLabel="Publicar noticia" />

<style>
	.back { display: inline-block; margin-bottom: 0.8rem; font-size: 0.9rem; }
	h1 { margin-bottom: 1.4rem; }
</style>
