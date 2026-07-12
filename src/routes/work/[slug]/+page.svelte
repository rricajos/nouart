<script lang="ts">
	import { enhance } from '$app/forms';
	let { data, form } = $props();
	const aw = $derived(data.artwork);

	// Optimistic copies of the server truth; resynced whenever `data` reloads.
	// svelte-ignore state_referenced_locally
	let liked = $state(data.liked);
	// svelte-ignore state_referenced_locally
	let likes = $state(data.likes);
	$effect(() => {
		liked = data.liked;
		likes = data.likes;
	});

	let showContact = $state(false);
</script>

<svelte:head>
	<title>{aw.title} — {aw.artist_name} · Nou Art</title>
	<meta name="description" content={aw.description.slice(0, 155)} />
</svelte:head>

<div class="wrap page">
	<a href="/gallery" class="back muted">← Galería</a>

	<div class="layout">
		<div class="figure">
			{#if aw.image}
				<img src="/uploads/{aw.image}" alt={aw.title} />
			{:else}
				<div class="noimg muted">Sin imagen</div>
			{/if}
		</div>

		<div class="details">
			<h1>{aw.title}</h1>
			<p class="by">
				por <a href="/artist/{aw.artist_slug}">{aw.artist_name}</a>
			</p>
			<div class="tags">
				{#if aw.year}<span class="chip">{aw.year}</span>{/if}
				{#if aw.medium}<span class="chip">{aw.medium}</span>{/if}
			</div>
			{#if aw.description}<p class="desc">{aw.description}</p>{/if}

			<div class="actions">
				<form method="POST" action="?/like" use:enhance={() => {
					// optimistic
					liked = !liked;
					likes += liked ? 1 : -1;
					return async ({ result, update }) => {
						if (result.type === 'success' && result.data) {
							liked = result.data.liked as boolean;
							likes = result.data.likes as number;
						}
						await update({ reset: false });
					};
				}}>
					<button class="like-btn" class:on={liked} aria-pressed={liked}>
						<span class="heart">{liked ? '♥' : '♡'}</span>
						<span>{likes}</span>
						<span class="lbl">{liked ? 'Te gusta' : 'Me gusta'}</span>
					</button>
				</form>
				<button class="btn" onclick={() => (showContact = !showContact)}>
					Contactar al artista
				</button>
			</div>

			{#if showContact}
				<div class="contact">
					{#if form?.contacted}
						<div class="flash flash-ok">¡Mensaje enviado! {aw.artist_name} lo recibirá pronto.</div>
					{:else}
						<form method="POST" action="?/contact" use:enhance>
							{#if form?.contactError}<div class="flash flash-err">{form.contactError}</div>{/if}
							<input type="text" name="website" class="hp" tabindex="-1" autocomplete="off" />
							<div class="row">
								<div class="field"><label for="c-name">Tu nombre</label><input id="c-name" name="name" required /></div>
								<div class="field"><label for="c-email">Tu email</label><input id="c-email" name="email" type="email" required /></div>
							</div>
							<div class="field">
								<label for="c-body">Mensaje</label>
								<textarea id="c-body" name="body" rows="4" required placeholder="Me interesa esta obra..."></textarea>
							</div>
							<button class="btn btn-primary btn-block">Enviar mensaje</button>
						</form>
					{/if}
				</div>
			{/if}
		</div>
	</div>

	<section class="comments">
		<h2>Opiniones</h2>

		{#if data.comments.length}
			<ul class="comment-list">
				{#each data.comments as c (c.id)}
					<li>
						<div class="c-head"><strong>{c.author}</strong> <span class="muted date">{c.created_at.slice(0, 10)}</span></div>
						<p>{c.body}</p>
					</li>
				{/each}
			</ul>
		{:else}
			<p class="muted">Todavía no hay opiniones. ¡Sé la primera persona en comentar!</p>
		{/if}

		<div class="comment-form">
			{#if form?.commented}
				<div class="flash flash-ok">
					{form.published ? '¡Gracias! Tu comentario ya está publicado.' : '¡Gracias! Tu comentario se publicará tras revisarlo.'}
				</div>
			{:else}
				<h3>Deja tu opinión</h3>
				<form method="POST" action="?/comment" use:enhance>
					{#if form?.commentError}<div class="flash flash-err">{form.commentError}</div>{/if}
					<input type="text" name="website" class="hp" tabindex="-1" autocomplete="off" />
					{#if data.user}
						<p class="as muted">Comentas como <strong>{data.user.name}</strong></p>
					{:else}
						<div class="field"><label for="cm-author">Nombre</label><input id="cm-author" name="author" required maxlength="60" /></div>
					{/if}
					<div class="field"><label for="cm-body">Comentario</label><textarea id="cm-body" name="body" rows="3" required maxlength="1000"></textarea></div>
					<button class="btn btn-primary">Publicar</button>
					{#if data.user}
						<p class="muted note">Se publica al instante.</p>
					{:else}
						<p class="muted note">Los comentarios se revisan antes de publicarse. <a href="/login">Entra</a> para publicar al instante.</p>
					{/if}
				</form>
			{/if}
		</div>
	</section>
</div>

<style>
	.page { padding: 1.8rem 0 2.5rem; }
	.back { display: inline-block; margin-bottom: 1.3rem; font-size: 0.95rem; }
	.back:hover { color: var(--accent); }
	.layout { display: grid; grid-template-columns: 1.35fr 1fr; gap: 2.2rem; align-items: start; }
	.figure { background: var(--surface-2); border-radius: var(--radius); overflow: hidden; box-shadow: var(--shadow); }
	.figure img { width: 100%; height: auto; }
	.noimg { aspect-ratio: 1; display: grid; place-items: center; }
	.details h1 { margin-bottom: 0.2rem; }
	.by { color: var(--muted); margin-bottom: 0.8rem; }
	.by a { color: var(--accent); }
	.tags { display: flex; gap: 0.4rem; margin-bottom: 1rem; }
	.desc { font-size: 1.05rem; }
	.actions { display: flex; flex-wrap: wrap; gap: 0.7rem; margin-top: 1.4rem; }
	.like-btn {
		display: inline-flex; align-items: center; gap: 0.5rem; font: inherit; font-size: 0.95rem;
		padding: 0.6rem 1.1rem; border-radius: 999px; cursor: pointer;
		border: 1px solid var(--line); background: var(--surface); color: var(--text); transition: all 0.15s;
	}
	.like-btn:hover { border-color: var(--accent); }
	.like-btn.on { background: var(--accent-soft); border-color: var(--accent); }
	.like-btn .heart { color: var(--accent); font-size: 1.2rem; line-height: 1; }
	.like-btn .lbl { color: var(--muted); }
	.contact { margin-top: 1.2rem; padding: 1.1rem; border: 1px solid var(--line); border-radius: var(--radius); background: var(--surface); }
	.row { display: grid; grid-template-columns: 1fr 1fr; gap: 0.8rem; }
	.hp { position: absolute; left: -9999px; width: 1px; height: 1px; }
	.comments { margin-top: 3rem; border-top: 1px solid var(--line); padding-top: 2rem; max-width: 720px; }
	.comment-list { list-style: none; padding: 0; margin: 0 0 2rem; display: flex; flex-direction: column; gap: 1.1rem; }
	.comment-list li { background: var(--surface); border: 1px solid var(--line); border-radius: var(--radius); padding: 0.9rem 1.1rem; }
	.c-head { display: flex; align-items: baseline; gap: 0.6rem; margin-bottom: 0.2rem; }
	.date { font-size: 0.82rem; }
	.comment-form { background: var(--surface-2); border-radius: var(--radius); padding: 1.3rem; }
	.comment-form h3 { margin-bottom: 0.9rem; }
	.comment-form .as { margin: 0 0 0.8rem; font-size: 0.95rem; }
	.comment-form .note a { color: var(--accent); text-decoration: underline; }
	.note { font-size: 0.82rem; margin: 0.6rem 0 0; }
	@media (max-width: 820px) {
		.layout { grid-template-columns: 1fr; }
	}
	@media (max-width: 520px) {
		.row { grid-template-columns: 1fr; }
	}
</style>
