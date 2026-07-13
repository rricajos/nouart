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
			<button type="submit" class="btn btn-primary btn-block">Entrar</button>
		</form>

		<p class="alt muted">
			<a href="/forgot">¿Olvidaste tu contraseña?</a>
			<span class="dot">·</span>
			¿No tienes cuenta? <a href="/register">Regístrate</a>
		</p>
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
	.alt { margin: 1.4rem 0 0; text-align: center; font-size: 0.95rem; line-height: 1.8; }
	.alt a { color: var(--accent); text-decoration: underline; }
	.dot { margin: 0 0.4rem; opacity: 0.5; }
</style>
