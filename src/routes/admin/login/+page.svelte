<script lang="ts">
	import { enhance } from '$app/forms';
	let { form } = $props();
</script>

<svelte:head><title>Acceso — Nou Art</title><meta name="robots" content="noindex" /></svelte:head>

<div class="login-wrap">
	<div class="login-card">
		<div class="brand"><span class="mark">◆</span> Nou Art</div>
		<h1>Gestión</h1>
		<p class="muted">Acceso para el equipo de la asociación.</p>
		<form method="POST" action="?/login" use:enhance>
			{#if form?.error}<div class="flash flash-err">{form.error}</div>{/if}
			<div class="field">
				<label for="pw">Contraseña</label>
				<!-- svelte-ignore a11y_autofocus -->
				<input id="pw" name="password" type="password" required autofocus />
			</div>
			<button class="btn btn-primary btn-block">Entrar</button>
		</form>
	</div>
</div>

<style>
	.login-wrap { min-height: 80vh; display: grid; place-items: center; padding: 2rem 1rem; }
	.login-card { width: 100%; max-width: 380px; background: var(--surface); border: 1px solid var(--line); border-radius: 14px; padding: 2rem; box-shadow: var(--shadow); }
	.brand { font-family: var(--serif); font-size: 1.2rem; margin-bottom: 1.2rem; }
	.mark { color: var(--accent); }
	.login-card h1 { font-size: 1.6rem; margin-bottom: 0.2rem; }
	.login-card p { margin-bottom: 1.4rem; }
</style>
