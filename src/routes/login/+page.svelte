<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/state';
	let { form } = $props();
	const justReset = $derived(page.url.searchParams.get('reset') === '1');
</script>

<svelte:head>
	<title>Entrar · Nou Art</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="wrap auth">
	<div class="card">
		<h1>Entrar</h1>
		<p class="muted sub">Accede a tu cuenta de Nou Art.</p>

		{#if justReset}
			<p class="flash flash-ok">Contraseña actualizada. Ya puedes entrar.</p>
		{/if}
		{#if form?.error}
			<p class="flash flash-err">{form.error}</p>
		{/if}

		<form method="POST" use:enhance>
			<div class="field">
				<label for="email">Email</label>
				<input id="email" name="email" type="email" autocomplete="email" required value={form?.email ?? ''} />
			</div>
			<div class="field">
				<label for="password">Contraseña</label>
				<input id="password" name="password" type="password" autocomplete="current-password" required />
			</div>
			<button type="submit" class="btn btn-primary btn-block big">Entrar</button>
		</form>

		<p class="forgot"><a href="/forgot">¿Olvidaste tu contraseña?</a></p>

		<div class="switch">
			<span class="switch-q">¿Todavía no tienes cuenta?</span>
			<a href="/register" class="btn btn-block switch-btn">Crear una cuenta nueva</a>
		</div>
	</div>
</div>

<style>
	.auth { max-width: 440px; padding: 3rem 1.25rem 4rem; }
	.card {
		background: var(--surface); border: 1px solid var(--line); border-radius: var(--radius);
		box-shadow: var(--shadow); padding: 2rem 1.8rem;
	}
	h1 { margin-bottom: 0.2rem; }
	.sub { margin-bottom: 1.6rem; }
	.btn-block { margin-top: 0.4rem; }
	.big { padding: 0.85rem 1.1rem; font-size: 1.05rem; }
	.forgot { margin: 1rem 0 0; text-align: center; font-size: 0.95rem; }
	.forgot a { color: var(--accent); text-decoration: underline; }
	.switch { margin-top: 1.4rem; padding-top: 1.4rem; border-top: 1px solid var(--line); text-align: center; }
	.switch-q { display: block; font-size: 1rem; color: var(--muted); margin-bottom: 0.7rem; }
	.switch-btn { padding: 0.75rem 1.1rem; font-size: 1.02rem; font-weight: 600; }
</style>
