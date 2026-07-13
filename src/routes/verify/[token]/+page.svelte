<script lang="ts">
	let { data } = $props();
</script>

<svelte:head>
	<title>Verificación de email · Nou Art</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="wrap auth">
	<div class="auth-card">
		{#if data.ok}
			<h1>Email verificado</h1>
			<p class="muted">¡Gracias! Tu dirección de email ha quedado confirmada.</p>
			<a href="/account" class="btn btn-primary btn-block">Ir a mi cuenta</a>
		{:else}
			<h1>Enlace no válido</h1>
			<p class="muted">Este enlace de verificación ha caducado o ya se usó. Puedes pedir uno nuevo desde tu cuenta.</p>
			<a href="/account" class="btn btn-block">Ir a mi cuenta</a>
		{/if}
	</div>
</div>

<style>
	.auth { max-width: 440px; padding: 3rem 1.25rem 4rem; }
	.auth-card { background: var(--surface); border: 1px solid var(--line); border-radius: var(--radius); box-shadow: var(--shadow); padding: 2rem 1.8rem; text-align: center; }
	h1 { margin-bottom: 0.4rem; }
	.btn-block { margin-top: 1.4rem; }
</style>
