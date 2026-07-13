<script lang="ts">
	import { enhance } from '$app/forms';
	let { data, form } = $props();
</script>

<svelte:head>
	<title>Nueva contraseña · Nou Art</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="wrap auth">
	<div class="card">
		<h1>Nueva contraseña</h1>
		{#if !data.valid && !form}
			<p class="muted">Este enlace ha caducado o ya se usó.</p>
			<a href="/forgot" class="btn btn-primary btn-block">Pedir uno nuevo</a>
		{:else if form?.expired}
			<p class="flash flash-err">{form.error}</p>
			<a href="/forgot" class="btn btn-primary btn-block">Pedir uno nuevo</a>
		{:else}
			<p class="muted sub">Escribe tu nueva contraseña.</p>
			{#if form?.error}<p class="flash flash-err">{form.error}</p>{/if}
			<form method="POST" use:enhance>
				<div class="field">
					<label for="password">Nueva contraseña</label>
					<input id="password" name="password" type="password" autocomplete="new-password" minlength="8" required />
					<span class="hint muted">Mínimo 8 caracteres.</span>
				</div>
				<button type="submit" class="btn btn-primary btn-block">Guardar contraseña</button>
			</form>
		{/if}
	</div>
</div>

<style>
	.auth { max-width: 440px; padding: 3rem 1.25rem 4rem; }
	.card { background: var(--surface); border: 1px solid var(--line); border-radius: var(--radius); box-shadow: var(--shadow); padding: 2rem 1.8rem; }
	h1 { margin-bottom: 0.5rem; }
	.sub { margin-bottom: 1.6rem; }
	.hint { display: block; font-size: 0.8rem; margin-top: 0.35rem; font-weight: 400; }
	.btn-block { margin-top: 0.6rem; }
</style>
