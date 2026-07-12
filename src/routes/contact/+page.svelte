<script lang="ts">
	import { enhance } from '$app/forms';
	import { contact, site } from '$lib/content';
	let { form } = $props();
</script>

<svelte:head>
	<title>Contacto — Nou Art</title>
	<meta name="description" content="Ponte en contacto con Nou Art, asociación cultural de Nou Barris." />
</svelte:head>

<div class="wrap page">
	<p class="eyebrow">Hablemos</p>
	<h1>Contacto</h1>
	<p class="intro muted">
		¿Quieres participar, proponer una actividad o exponer con nosotros? Escríbenos y te
		respondemos.
	</p>

	<div class="layout">
		<div class="form-col">
			{#if form?.sent}
				<div class="flash flash-ok">¡Gracias! Hemos recibido tu mensaje y te responderemos pronto.</div>
			{:else}
				<form method="POST" use:enhance>
					{#if form?.error}<div class="flash flash-err">{form.error}</div>{/if}
					<input type="text" name="website" class="hp" tabindex="-1" autocomplete="off" />
					<div class="row">
						<div class="field">
							<label for="name">Nombre</label>
							<input id="name" name="name" required value={form?.name ?? ''} />
						</div>
						<div class="field">
							<label for="phone">Teléfono <span class="opt">(opcional)</span></label>
							<input id="phone" name="phone" value={form?.phone ?? ''} />
						</div>
					</div>
					<div class="field">
						<label for="email">Correo electrónico</label>
						<input id="email" name="email" type="email" required value={form?.email ?? ''} />
					</div>
					<div class="field">
						<label for="body">Mensaje</label>
						<textarea id="body" name="body" rows="5" required>{form?.body ?? ''}</textarea>
					</div>
					<button class="btn btn-primary">Enviar mensaje</button>
				</form>
			{/if}
		</div>

		<aside class="info">
			<h2>{site.name}</h2>
			<ul>
				<li><span class="lbl">Dónde</span> {contact.location}</li>
				<li><span class="lbl">Email</span> <a href="mailto:{contact.email}">{contact.email}</a></li>
				{#if contact.phone}<li><span class="lbl">Teléfono</span> <a href="tel:{contact.phone}">{contact.phone}</a></li>{/if}
				{#if contact.hours}<li><span class="lbl">Horario</span> {contact.hours}</li>{/if}
			</ul>
		</aside>
	</div>
</div>

<style>
	.page { padding: 2.5rem 0; }
	.intro { max-width: 52ch; margin-top: -0.5rem; }
	.layout { display: grid; grid-template-columns: 1.4fr 1fr; gap: 2.5rem; margin-top: 2rem; align-items: start; }
	.row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
	.opt { font-weight: 400; color: var(--muted); }
	.hp { position: absolute; left: -9999px; width: 1px; height: 1px; }
	.info { background: var(--surface); border: 1px solid var(--line); border-radius: var(--radius); padding: 1.6rem; box-shadow: var(--shadow); }
	.info h2 { font-size: 1.3rem; margin-bottom: 1rem; }
	.info ul { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.9rem; }
	.info .lbl { display: block; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.08em; color: var(--muted); margin-bottom: 0.1rem; }
	.info a { color: var(--accent); }
	@media (max-width: 780px) {
		.layout { grid-template-columns: 1fr; }
	}
	@media (max-width: 520px) { .row { grid-template-columns: 1fr; } }
</style>
