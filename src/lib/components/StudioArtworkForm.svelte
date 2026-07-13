<script lang="ts">
	import { enhance } from '$app/forms';
	import type { Artwork } from '$lib/server/db';

	interface Props {
		artwork?: Artwork | null;
		form?: { error?: string } | null;
		action?: string;
		submitLabel?: string;
	}
	let { artwork = null, form = null, action = '', submitLabel = 'Guardar' }: Props = $props();
</script>

<form method="POST" {action} enctype="multipart/form-data" use:enhance>
	{#if form?.error}<div class="flash flash-err">{form.error}</div>{/if}

	<div class="field">
		<label for="title">Título *</label>
		<input id="title" name="title" required value={artwork?.title ?? ''} />
	</div>

	<div class="field">
		<label for="description">Descripción</label>
		<textarea id="description" name="description" rows="4">{artwork?.description ?? ''}</textarea>
	</div>

	<div class="grid2">
		<div class="field">
			<label for="year">Año</label>
			<input id="year" name="year" value={artwork?.year ?? ''} />
		</div>
		<div class="field">
			<label for="medium">Técnica / medio</label>
			<input id="medium" name="medium" placeholder="Óleo sobre lienzo…" value={artwork?.medium ?? ''} />
		</div>
	</div>

	<div class="field">
		<label for="image">Imagen {artwork?.image ? '(dejar vacío para conservar la actual)' : '*'}</label>
		{#if artwork?.image}<img class="preview" src="/uploads/{artwork.image}" alt="Imagen actual" />{/if}
		<input id="image" name="image" type="file" accept="image/*" />
	</div>

	<label class="check">
		<input type="checkbox" name="published" checked={artwork ? !!artwork.published : true} />
		<span>Publicada (visible en la web)</span>
	</label>

	<div class="actions">
		<button class="btn btn-primary">{submitLabel}</button>
		<a href="/studio" class="btn">Cancelar</a>
	</div>
</form>

<style>
	form { max-width: 640px; }
	.grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
	.preview { width: 120px; height: 120px; object-fit: cover; border-radius: 10px; margin-bottom: 0.5rem; border: 1px solid var(--line); }
	.check { display: flex; align-items: center; gap: 0.5rem; font-weight: 500; color: var(--text); margin: 0.5rem 0 0; }
	.check input { width: auto; }
	.actions { display: flex; gap: 0.7rem; margin-top: 1.2rem; }
	@media (max-width: 520px) { .grid2 { grid-template-columns: 1fr; } }
</style>
