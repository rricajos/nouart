<script lang="ts">
	import { enhance } from '$app/forms';
	let { form } = $props();
</script>

<svelte:head>
	<title>Recuperar contraseña · Nou Art</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="wrap auth">
	<div class="auth-card">
		<h1>Recuperar contraseña</h1>
		{#if form?.sent}
			<p class="muted">
				Si hay una cuenta con ese email, te hemos enviado un enlace para restablecer tu contraseña.
				Revisa tu bandeja de entrada.
			</p>
			<a href="/login" class="btn btn-block">Volver a entrar</a>
		{:else}
			<p class="muted sub">Introduce tu email y te enviaremos un enlace para crear una nueva contraseña.</p>
			<form method="POST" use:enhance>
				<div class="field">
					<label for="email">Email</label>
					<input id="email" name="email" type="email" autocomplete="email" required />
				</div>
				<button type="submit" class="btn btn-primary btn-block">Enviar enlace</button>
			</form>
			<p class="alt muted"><a href="/login">Volver a entrar</a></p>
		{/if}
	</div>
</div>

<style>
	.auth { max-width: 440px; padding: 3rem 1.25rem 4rem; }
	.auth-card { background: var(--surface); border: 1px solid var(--line); border-radius: var(--radius); box-shadow: var(--shadow); padding: 2rem 1.8rem; }
	h1 { margin-bottom: 0.5rem; }
	.sub { margin-bottom: 1.6rem; }
	.btn-block { margin-top: 0.4rem; }
	.alt { margin: 1.4rem 0 0; text-align: center; font-size: 0.95rem; }
	.alt a { color: var(--accent); text-decoration: underline; }
</style>
