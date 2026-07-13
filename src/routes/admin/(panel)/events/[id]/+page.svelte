<script lang="ts">
	import EventForm from '$lib/components/EventForm.svelte';
	let { data, form } = $props();
</script>

<svelte:head><title>Editar actividad · Gestión</title></svelte:head>

<a href="/admin/events" class="muted back">← Agenda</a>
<div class="head">
	<h1>Editar actividad</h1>
	{#if data.event.published}<a href="/agenda/{data.event.slug}" target="_blank" class="muted small">Ver en la web ↗</a>{/if}
</div>
<EventForm event={data.event} {form} submitLabel="Guardar cambios" />

<style>
	.back { display: inline-block; margin-bottom: 0.8rem; font-size: 0.9rem; }
	.head { display: flex; align-items: baseline; justify-content: space-between; gap: 1rem; margin-bottom: 1.4rem; }
	.small { font-size: 0.85rem; }
</style>
