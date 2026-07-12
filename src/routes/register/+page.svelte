<script lang="ts">
	import { enhance } from '$app/forms';
	let { form } = $props();
	let role = $state<'member' | 'artist'>(form?.role === 'artist' ? 'artist' : 'member');
</script>

<svelte:head>
	<title>Crear cuenta · Nou Art</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="wrap auth">
	<div class="card">
		<h1>Crear cuenta</h1>
		<p class="muted sub">Únete a la comunidad de Nou Art.</p>

		{#if form?.error}
			<p class="flash flash-err">{form.error}</p>
		{/if}

		<form method="POST" use:enhance>
			<div class="field">
				<label for="name">Nombre</label>
				<input id="name" name="name" type="text" autocomplete="name" required value={form?.name ?? ''} />
			</div>
			<div class="field">
				<label for="email">Email</label>
				<input id="email" name="email" type="email" autocomplete="email" required value={form?.email ?? ''} />
			</div>
			<div class="field">
				<label for="password">Contraseña</label>
				<input id="password" name="password" type="password" autocomplete="new-password" minlength="8" required />
				<span class="hint muted">Mínimo 8 caracteres.</span>
			</div>

			<div class="field">
				<span class="role-label">Tipo de cuenta</span>
				<div class="roles">
					<label class="role" class:sel={role === 'member'}>
						<input type="radio" name="role" value="member" bind:group={role} />
						<span class="role-title">Visitante</span>
						<span class="role-desc muted">Comenta y guarda tus obras favoritas.</span>
					</label>
					<label class="role" class:sel={role === 'artist'}>
						<input type="radio" name="role" value="artist" bind:group={role} />
						<span class="role-title">Artista</span>
						<span class="role-desc muted">Muestra tu obra. Requiere aprobación del equipo.</span>
					</label>
				</div>
			</div>

			<button type="submit" class="btn btn-primary btn-block">Crear cuenta</button>
		</form>

		<p class="alt muted">¿Ya tienes cuenta? <a href="/login">Entra</a></p>
	</div>
</div>

<style>
	.auth { max-width: 460px; padding: 3rem 1.25rem 4rem; }
	.card {
		background: var(--surface); border: 1px solid var(--line); border-radius: var(--radius);
		box-shadow: var(--shadow); padding: 2rem 1.8rem;
	}
	h1 { margin-bottom: 0.2rem; }
	.sub { margin-bottom: 1.6rem; }
	.hint { display: block; font-size: 0.8rem; margin-top: 0.35rem; font-weight: 400; }
	.role-label { display: block; font-size: 0.85rem; font-weight: 600; margin: 0 0 0.5rem; color: var(--muted); }
	.roles { display: grid; gap: 0.7rem; grid-template-columns: 1fr 1fr; }
	.role {
		display: flex; flex-direction: column; gap: 0.2rem; cursor: pointer; margin: 0;
		padding: 0.8rem 0.9rem; border: 1px solid var(--line); border-radius: 10px;
		transition: border-color 0.15s, background 0.15s;
	}
	.role.sel { border-color: var(--accent); background: var(--accent-soft); }
	.role input { position: absolute; opacity: 0; width: 0; height: 0; }
	.role-title { font-weight: 600; font-size: 0.95rem; color: var(--text); }
	.role-desc { font-size: 0.8rem; line-height: 1.35; font-weight: 400; }
	.btn-block { margin-top: 1.4rem; }
	.alt { margin: 1.4rem 0 0; text-align: center; font-size: 0.95rem; }
	.alt a { color: var(--accent); text-decoration: underline; }
	@media (max-width: 420px) { .roles { grid-template-columns: 1fr; } }
</style>
