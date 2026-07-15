<script lang="ts">
	import { enhance } from '$app/forms';
	import type { News } from '$lib/server/db';

	interface Props {
		post?: News | null;
		form?: { error?: string } | null;
		submitLabel?: string;
	}
	let { post = null, form = null, submitLabel = 'Guardar' }: Props = $props();
</script>

<form method="POST" enctype="multipart/form-data" use:enhance>
	{#if form?.error}<div class="flash flash-err">{form.error}</div>{/if}

	<div class="grid2">
		<div class="field">
			<label for="title">Título *</label>
			<input id="title" name="title" required value={post?.title ?? ''} />
		</div>
		<div class="field">
			<label for="date">Fecha de publicación</label>
			<input id="date" name="date" type="date" value={post?.date ?? ''} />
		</div>
	</div>

	<div class="field">
		<label for="summary">Resumen (aparece en la lista)</label>
		<input id="summary" name="summary" maxlength="200" value={post?.summary ?? ''} />
	</div>

	<div class="field">
		<label for="body">Texto</label>
		<textarea id="body" name="body" rows="10">{post?.body ?? ''}</textarea>
	</div>

	<div class="field">
		<label for="image">Imagen {post?.image ? '(dejar vacío para conservar la actual)' : ''}</label>
		{#if post?.image}<img class="preview" src="/uploads/{post.image}" alt="Imagen actual" />{/if}
		<input id="image" name="image" type="file" accept="image/*" />
	</div>

	<label class="check">
		<input type="checkbox" name="published" checked={post ? !!post.published : true} />
		<span>Publicada (visible en la web)</span>
	</label>

	<div class="actions">
		<button class="btn btn-primary">{submitLabel}</button>
		<a href="/admin/news" class="btn">Cancelar</a>
	</div>
</form>

<style>
	form { max-width: 680px; }
	.grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
	.preview { width: 160px; height: 90px; object-fit: cover; border-radius: 10px; margin-bottom: 0.5rem; border: 1px solid var(--line); }
	.check { display: flex; align-items: center; gap: 0.5rem; font-weight: 500; color: var(--text); margin: 0.5rem 0 0; }
	.check input { width: auto; }
	.actions { display: flex; gap: 0.7rem; margin-top: 1.2rem; }
	@media (max-width: 560px) { .grid2 { grid-template-columns: 1fr; } }
</style>
