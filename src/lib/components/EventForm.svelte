<script lang="ts">
	import { enhance } from '$app/forms';
	import type { Event } from '$lib/server/db';

	interface Props {
		event?: Event | null;
		form?: { error?: string } | null;
		action?: string;
		submitLabel?: string;
	}
	let { event = null, form = null, action = '', submitLabel = 'Guardar' }: Props = $props();
</script>

<form method="POST" {action} enctype="multipart/form-data" use:enhance>
	{#if form?.error}<div class="flash flash-err">{form.error}</div>{/if}

	<div class="field">
		<label for="title">Título *</label>
		<input id="title" name="title" required value={event?.title ?? ''} />
	</div>

	<div class="grid3">
		<div class="field">
			<label for="date">Fecha</label>
			<input id="date" name="date" type="date" value={event?.date ?? ''} />
		</div>
		<div class="field">
			<label for="time">Hora</label>
			<input id="time" name="time" placeholder="18:00" value={event?.time ?? ''} />
		</div>
		<div class="field">
			<label for="location">Lugar</label>
			<input id="location" name="location" placeholder="Centro cívico…" value={event?.location ?? ''} />
		</div>
	</div>

	<div class="field">
		<label for="summary">Resumen (aparece en la lista)</label>
		<input id="summary" name="summary" maxlength="200" value={event?.summary ?? ''} />
	</div>

	<div class="field">
		<label for="body">Descripción</label>
		<textarea id="body" name="body" rows="6">{event?.body ?? ''}</textarea>
	</div>

	<div class="field">
		<label for="image">Imagen {event?.image ? '(dejar vacío para conservar la actual)' : ''}</label>
		{#if event?.image}<img class="preview" src="/uploads/{event.image}" alt="Imagen actual" />{/if}
		<input id="image" name="image" type="file" accept="image/*" />
	</div>

	<label class="check">
		<input type="checkbox" name="published" checked={event ? !!event.published : true} />
		<span>Publicada (visible en la agenda)</span>
	</label>

	<div class="actions">
		<button class="btn btn-primary">{submitLabel}</button>
		<a href="/admin/events" class="btn">Cancelar</a>
	</div>
</form>

<style>
	form { max-width: 680px; }
	.grid3 { display: grid; grid-template-columns: 1fr 1fr 1.4fr; gap: 1rem; }
	.preview { width: 160px; height: 90px; object-fit: cover; border-radius: 10px; margin-bottom: 0.5rem; border: 1px solid var(--line); }
	.check { display: flex; align-items: center; gap: 0.5rem; font-weight: 500; color: var(--text); margin: 0.5rem 0 0; }
	.check input { width: auto; }
	.actions { display: flex; gap: 0.7rem; margin-top: 1.2rem; }
	@media (max-width: 560px) { .grid3 { grid-template-columns: 1fr; } }
</style>
