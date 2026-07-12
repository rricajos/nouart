<script lang="ts">
	import { enhance } from '$app/forms';
	import type { Artist } from '$lib/server/db';
	let {
		artist = null,
		form = null
	}: { artist?: Artist | null; form?: { error?: string } | null } = $props();
</script>

<form method="POST" enctype="multipart/form-data" use:enhance>
	{#if form?.error}<div class="flash flash-err">{form.error}</div>{/if}

	<div class="field">
		<label for="name">Nombre *</label>
		<input id="name" name="name" required value={artist?.name ?? ''} />
	</div>
	<div class="field">
		<label for="discipline">Disciplina</label>
		<input id="discipline" name="discipline" placeholder="Pintura, fotografía…" value={artist?.discipline ?? ''} />
	</div>
	<div class="field">
		<label for="bio">Biografía</label>
		<textarea id="bio" name="bio" rows="5">{artist?.bio ?? ''}</textarea>
	</div>

	<div class="grid2">
		<div class="field">
			<label for="email">Email (recibe los mensajes)</label>
			<input id="email" name="email" type="email" value={artist?.email ?? ''} />
		</div>
		<div class="field">
			<label for="instagram">Instagram (sin @)</label>
			<input id="instagram" name="instagram" value={artist?.instagram ?? ''} />
		</div>
	</div>
	<div class="field">
		<label for="website">Web</label>
		<input id="website" name="website" type="url" placeholder="https://…" value={artist?.website ?? ''} />
	</div>

	<div class="field">
		<label for="photo">Foto {artist?.photo ? '(dejar vacío para conservar la actual)' : ''}</label>
		{#if artist?.photo}<img class="preview" src="/uploads/{artist.photo}" alt="Foto actual" />{/if}
		<input id="photo" name="photo" type="file" accept="image/*" />
	</div>

	<div class="actions">
		<button class="btn btn-primary">{artist ? 'Guardar cambios' : 'Crear artista'}</button>
		<a href="/admin/artists" class="btn">Cancelar</a>
	</div>
</form>

<style>
	form { max-width: 620px; }
	.grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
	.preview { width: 90px; height: 90px; object-fit: cover; border-radius: 10px; margin-bottom: 0.5rem; border: 1px solid var(--line); }
	.actions { display: flex; gap: 0.7rem; margin-top: 1rem; }
	@media (max-width: 520px) { .grid2 { grid-template-columns: 1fr; } }
</style>
