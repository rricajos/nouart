<script lang="ts">
	import { enhance } from '$app/forms';
	import ArtworkCard from '$lib/components/ArtworkCard.svelte';
	let { data, form } = $props();
	const acc = $derived(data.account);
</script>

<svelte:head>
	<title>Mi cuenta · Nou Art</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="wrap page">
	<div class="head">
		<div>
			<p class="eyebrow">Mi cuenta</p>
			<h1>{acc.name}</h1>
			<p class="muted">{acc.email}</p>
		</div>
		<form method="POST" action="/logout" use:enhance>
			<button class="btn logout" type="submit">Cerrar sesión</button>
		</form>
	</div>

	{#if !acc.email_verified}
		<div class="verify-banner">
			{#if form?.vSent}
				<span>Te hemos enviado un email de verificación. Revisa tu bandeja.</span>
			{:else}
				<span>Tu email aún no está verificado.</span>
				<form method="POST" action="?/resendVerify" use:enhance>
					<button class="link-btn" type="submit">Reenviar verificación</button>
				</form>
			{/if}
		</div>
	{/if}

	{#if acc.role === 'artist'}
		<section class="artist-box">
			{#if acc.approved && data.artistSlug}
				<h2>Cuenta de artista</h2>
				<p class="muted">Tu perfil está activo. Gestiónalo desde tu estudio.</p>
				<div class="row">
					<a href="/studio" class="btn btn-primary">Ir a mi estudio</a>
					<a href="/artist/{data.artistSlug}" class="btn">Ver mi perfil público</a>
				</div>
			{:else}
				<h2>Cuenta de artista · pendiente</h2>
				<p class="muted">
					Tu solicitud de artista está pendiente de aprobación por el equipo de Nou Art. Te
					avisaremos y podrás gestionar tu perfil y tu obra en cuanto se active.
				</p>
			{/if}
		</section>
	{/if}

	<section class="favs">
		<h2>Mis obras favoritas</h2>
		{#if data.favorites.length}
			<div class="fav-grid">
				{#each data.favorites as artwork (artwork.id)}
					<ArtworkCard {artwork} />
				{/each}
			</div>
		{:else}
			<p class="muted fav-empty">
				Aún no has guardado ninguna obra. Explora la <a href="/gallery">galería</a> y pulsa el
				corazón para guardarla aquí.
			</p>
		{/if}
	</section>

	<div class="grid">
		<section class="panel">
			<h2>Perfil</h2>
			{#if form?.pOk}<p class="flash flash-ok">Perfil actualizado.</p>{/if}
			{#if form?.pError}<p class="flash flash-err">{form.pError}</p>{/if}
			<form method="POST" action="?/profile" use:enhance>
				<div class="field">
					<label for="name">Nombre</label>
					<input id="name" name="name" type="text" required value={acc.name} />
				</div>
				<button class="btn" type="submit">Guardar</button>
			</form>
		</section>

		<section class="panel">
			<h2>Contraseña</h2>
			{#if form?.pwOk}<p class="flash flash-ok">Contraseña actualizada.</p>{/if}
			{#if form?.pwError}<p class="flash flash-err">{form.pwError}</p>{/if}
			<form method="POST" action="?/password" use:enhance>
				<div class="field">
					<label for="current">Contraseña actual</label>
					<input id="current" name="current" type="password" autocomplete="current-password" required />
				</div>
				<div class="field">
					<label for="next">Nueva contraseña</label>
					<input id="next" name="next" type="password" autocomplete="new-password" minlength="8" required />
				</div>
				<button class="btn" type="submit">Cambiar contraseña</button>
			</form>
		</section>
	</div>
</div>

<style>
	.page { padding: 2.5rem 0 4rem; max-width: 820px; }
	.head { display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; margin-bottom: 2rem; }
	.head h1 { margin: 0.1rem 0 0.2rem; }
	.logout { font-size: 0.9rem; }
	.verify-banner {
		display: flex; align-items: center; gap: 0.8rem; flex-wrap: wrap;
		background: var(--accent-soft); border: 1px solid var(--accent); border-radius: 10px;
		padding: 0.7rem 1rem; margin-bottom: 1.6rem; font-size: 0.92rem;
	}
	.verify-banner form { margin: 0; }
	.link-btn { font: inherit; font-size: 0.92rem; font-weight: 600; color: var(--accent); background: none; border: 0; cursor: pointer; text-decoration: underline; padding: 0; }
	.artist-box {
		background: var(--surface); border: 1px solid var(--line); border-left: 3px solid var(--accent);
		border-radius: var(--radius); padding: 1.4rem 1.5rem; margin-bottom: 2rem;
	}
	.artist-box h2 { font-size: 1.2rem; margin-bottom: 0.4rem; }
	.artist-box .row { display: flex; gap: 0.6rem; flex-wrap: wrap; margin-top: 1rem; }
	.favs { margin-bottom: 2rem; }
	.favs h2 { font-size: 1.2rem; margin-bottom: 1rem; }
	.fav-grid { display: grid; gap: 1.2rem; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); }
	.fav-empty { padding: 1.2rem 1.4rem; background: var(--surface); border: 1px dashed var(--line); border-radius: var(--radius); }
	.fav-empty a { color: var(--accent); text-decoration: underline; }
	.grid { display: grid; gap: 1.4rem; grid-template-columns: 1fr 1fr; }
	.panel {
		background: var(--surface); border: 1px solid var(--line); border-radius: var(--radius);
		box-shadow: var(--shadow); padding: 1.5rem;
	}
	.panel h2 { font-size: 1.15rem; margin-bottom: 1rem; }
	.panel .btn { margin-top: 0.3rem; }
	@media (max-width: 640px) { .grid { grid-template-columns: 1fr; } }
</style>
