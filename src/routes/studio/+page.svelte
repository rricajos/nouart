<script lang="ts">
	import { enhance } from '$app/forms';
	let { data, form } = $props();
	const a = $derived(data.artist);
</script>

<svelte:head>
	<title>Mi estudio · Nou Art</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="wrap page">
	<p class="eyebrow">Mi estudio</p>
	<h1>Estudio de artista</h1>

	{#if !data.approved || !a}
		<div class="pending">
			<h2>Cuenta pendiente de aprobación</h2>
			<p class="muted">
				En cuanto el equipo de Nou Art apruebe tu cuenta de artista podrás editar tu perfil y
				aparecer en la web. Gracias por tu paciencia.
			</p>
			<a href="/account" class="btn">Volver a mi cuenta</a>
		</div>
	{:else}
		<section class="panel">
			<div class="panel-head">
				<h2>Perfil público</h2>
				<a href="/artist/{a.slug}" class="muted small" target="_blank">Ver en la web ↗</a>
			</div>
			{#if form?.ok}<p class="flash flash-ok">Perfil guardado.</p>{/if}
			{#if form?.error}<p class="flash flash-err">{form.error}</p>{/if}
			<form method="POST" action="?/profile" use:enhance>
				<div class="two">
					<div class="field">
						<label for="name">Nombre de artista</label>
						<input id="name" name="name" type="text" required value={a.name} />
					</div>
					<div class="field">
						<label for="discipline">Disciplina</label>
						<input id="discipline" name="discipline" type="text" placeholder="Pintura, fotografía…" value={a.discipline} />
					</div>
				</div>
				<div class="field">
					<label for="bio">Biografía</label>
					<textarea id="bio" name="bio" rows="5">{a.bio}</textarea>
				</div>
				<div class="two">
					<div class="field">
						<label for="website">Web</label>
						<input id="website" name="website" type="url" placeholder="https://…" value={a.website ?? ''} />
					</div>
					<div class="field">
						<label for="instagram">Instagram</label>
						<input id="instagram" name="instagram" type="text" placeholder="@usuario" value={a.instagram ?? ''} />
					</div>
				</div>
				<div class="field">
					<label for="email">Email de contacto (para mensajes de tu obra)</label>
					<input id="email" name="email" type="email" value={a.email ?? ''} />
				</div>
				<button class="btn btn-primary" type="submit">Guardar perfil</button>
			</form>
		</section>

		<section class="panel">
			<div class="panel-head">
				<h2>Mis obras <span class="count muted">({data.artworks.length})</span></h2>
				<a href="/studio/works/new" class="btn btn-primary">+ Añadir obra</a>
			</div>
			{#if data.artworks.length}
				<ul class="works">
					{#each data.artworks as w (w.id)}
						<li>
							<a class="w-link" href="/studio/works/{w.id}">
								<span class="w-thumb">
									{#if w.image}<img src="/uploads/{w.image}" alt="" />{/if}
								</span>
								<span class="w-title">{w.title}</span>
							</a>
							<span class="chip" class:hidden-chip={!w.published}>{w.published ? 'Publicada' : 'Oculta'}</span>
						</li>
					{/each}
				</ul>
			{:else}
				<p class="muted empty">Todavía no tienes obras. Añade la primera con el botón de arriba.</p>
			{/if}
		</section>
	{/if}
</div>

<style>
	.page { padding: 2.5rem 0 4rem; max-width: 820px; }
	h1 { margin-bottom: 1.6rem; }
	.pending {
		background: var(--surface); border: 1px solid var(--line); border-left: 3px solid var(--accent);
		border-radius: var(--radius); padding: 1.6rem 1.6rem 1.8rem;
	}
	.pending h2 { font-size: 1.2rem; margin-bottom: 0.4rem; }
	.pending .btn { margin-top: 1rem; }
	.panel {
		background: var(--surface); border: 1px solid var(--line); border-radius: var(--radius);
		box-shadow: var(--shadow); padding: 1.6rem; margin-bottom: 1.4rem;
	}
	.panel-head { display: flex; align-items: baseline; justify-content: space-between; gap: 1rem; }
	.panel h2 { font-size: 1.15rem; margin-bottom: 1rem; }
	.small { font-size: 0.85rem; }
	.two { display: grid; gap: 0 1rem; grid-template-columns: 1fr 1fr; }
	.works { list-style: none; padding: 0; margin: 0; }
	.works li { display: flex; align-items: center; justify-content: space-between; gap: 1rem; padding: 0.55rem 0; border-bottom: 1px solid var(--line); }
	.w-link { display: flex; align-items: center; gap: 0.8rem; min-width: 0; flex: 1; }
	.w-thumb { width: 46px; height: 46px; border-radius: 8px; overflow: hidden; background: var(--surface-2); flex: none; }
	.w-thumb img { width: 100%; height: 100%; object-fit: cover; }
	.w-title { font-weight: 500; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
	.w-link:hover .w-title { color: var(--accent); }
	.hidden-chip { opacity: 0.7; }
	.empty { padding: 0.4rem 0; }
	@media (max-width: 560px) { .two { grid-template-columns: 1fr; } }
</style>
