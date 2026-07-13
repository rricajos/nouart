<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/state';

	type Step = 'email' | 'login' | 'register';
	let { form }: { form: Record<string, string> | null } = $props();

	let step = $state<Step>((form?.step as Step) ?? 'email');
	let email = $state(form?.email ?? '');
	let role = $state<'member' | 'artist'>(form?.role === 'artist' ? 'artist' : 'member');
	const justReset = $derived(page.url.searchParams.get('reset') === '1');

	// El error solo se muestra si corresponde al paso actual (evita mensajes obsoletos).
	const errorMsg = $derived(form?.step === step ? form?.error : undefined);

	// Paso 1 (check): al continuar, saltamos a login o register según exista la cuenta.
	const onCheck = () => async ({ result, update }: any) => {
		if (result.type === 'success' && result.data?.step) {
			email = result.data.email;
			step = result.data.step;
		} else {
			await update(); // email inválido → mostramos el error y seguimos en el paso email
		}
	};

	function changeEmail() {
		step = 'email';
	}
</script>

<svelte:head>
	<title>Entrar · Nou Art</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="wrap auth">
	<div class="card">
		<h1>{step === 'register' ? 'Crea tu cuenta' : 'Entrar en Nou Art'}</h1>

		{#if justReset && step === 'email'}
			<p class="flash flash-ok">Contraseña actualizada. Entra con tu email.</p>
		{/if}
		{#if errorMsg}
			<p class="flash flash-err">{errorMsg}</p>
		{/if}

		{#if step === 'email'}
			<p class="muted sub">Escribe tu email para entrar o crear tu cuenta.</p>
			<form method="POST" action="?/check" use:enhance={onCheck}>
				<div class="field">
					<label for="email">Email</label>
					<input id="email" name="email" type="email" autocomplete="email" required bind:value={email} />
				</div>
				<button class="btn btn-primary btn-block big">Continuar</button>
			</form>
		{:else if step === 'login'}
			<p class="muted sub">Ya tienes cuenta con nosotros. Escribe tu contraseña.</p>
			<div class="ident">
				<span class="ident-mail">{email}</span>
				<button type="button" class="change" onclick={changeEmail}>Cambiar</button>
			</div>
			<form method="POST" action="?/login" use:enhance>
				<input type="hidden" name="email" value={email} />
				<div class="field">
					<label for="password">Contraseña</label>
					<!-- svelte-ignore a11y_autofocus -->
					<input id="password" name="password" type="password" autocomplete="current-password" required autofocus />
				</div>
				<button class="btn btn-primary btn-block big">Entrar</button>
			</form>
			<p class="forgot"><a href="/forgot">¿Olvidaste tu contraseña?</a></p>
		{:else}
			<p class="muted sub">No hay ninguna cuenta con ese email todavía. Vamos a crearla.</p>
			<div class="ident">
				<span class="ident-mail">{email}</span>
				<button type="button" class="change" onclick={changeEmail}>Cambiar</button>
			</div>
			<form method="POST" action="?/register" use:enhance>
				<input type="hidden" name="email" value={email} />
				<div class="field">
					<label for="name">Tu nombre</label>
					<!-- svelte-ignore a11y_autofocus -->
					<input id="name" name="name" type="text" autocomplete="name" required value={form?.name ?? ''} autofocus />
				</div>
				<div class="field">
					<label for="rpassword">Crea una contraseña</label>
					<input id="rpassword" name="password" type="password" autocomplete="new-password" minlength="8" required />
					<span class="hint muted">Mínimo 8 caracteres.</span>
				</div>
				<div class="field">
					<span class="role-label">¿Cómo quieres participar?</span>
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
				<button class="btn btn-primary btn-block big">Crear cuenta</button>
			</form>
		{/if}
	</div>
</div>

<style>
	.auth { max-width: 460px; padding: 3rem 1.25rem 4rem; }
	.card { background: var(--surface); border: 1px solid var(--line); border-radius: var(--radius); box-shadow: var(--shadow); padding: 2rem 1.8rem; }
	h1 { margin-bottom: 0.4rem; }
	.sub { margin-bottom: 1.6rem; font-size: 1rem; }
	.big { padding: 0.85rem 1.1rem; font-size: 1.05rem; margin-top: 0.6rem; }
	.hint { display: block; font-size: 0.8rem; margin-top: 0.35rem; font-weight: 400; }

	.ident { display: flex; align-items: center; justify-content: space-between; gap: 1rem; background: var(--surface-2); border: 1px solid var(--line); border-radius: 10px; padding: 0.6rem 0.9rem; margin-bottom: 1.1rem; }
	.ident-mail { font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
	.change { font: inherit; font-size: 0.9rem; color: var(--accent); background: none; border: 0; cursor: pointer; text-decoration: underline; flex: none; }

	.forgot { margin: 1.1rem 0 0; text-align: center; font-size: 0.95rem; }
	.forgot a { color: var(--accent); text-decoration: underline; }

	.role-label { display: block; font-size: 0.9rem; font-weight: 600; margin: 0 0 0.5rem; color: var(--muted); }
	.roles { display: grid; gap: 0.7rem; grid-template-columns: 1fr 1fr; }
	.role { display: flex; flex-direction: column; gap: 0.2rem; cursor: pointer; margin: 0; padding: 0.8rem 0.9rem; border: 1px solid var(--line); border-radius: 10px; transition: border-color 0.15s, background 0.15s; }
	.role.sel { border-color: var(--accent); background: var(--accent-soft); }
	.role input { position: absolute; opacity: 0; width: 0; height: 0; }
	.role-title { font-weight: 600; font-size: 0.95rem; color: var(--text); }
	.role-desc { font-size: 0.8rem; line-height: 1.35; font-weight: 400; }
	@media (max-width: 420px) { .roles { grid-template-columns: 1fr; } }
</style>
