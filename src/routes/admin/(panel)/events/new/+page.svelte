<script lang="ts">
	import EventForm from '$lib/components/EventForm.svelte';
	let { form } = $props();
</script>

<svelte:head><title>Nueva actividad · Gestión</title></svelte:head>

<a href="/admin/events" class="muted back">← Agenda</a>
<h1>Nueva actividad</h1>
<EventForm {form} submitLabel="Crear actividad" />

<style>
	.back { display: inline-block; margin-bottom: 0.8rem; font-size: 0.9rem; }
	h1 { margin-bottom: 1.4rem; }
</style>
