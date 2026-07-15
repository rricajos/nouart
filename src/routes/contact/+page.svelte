<script lang="ts">
	import { enhance } from '$app/forms';
	import { contact, site } from '$lib/content';
	import { ATTACH_HINT, ATTACH_ACCEPT } from '$lib/uploads-limits';
	let { data, form } = $props();
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
				<div class="sent">
					<div class="flash flash-ok">¡Gracias! Hemos recibido tu mensaje y te responderemos pronto.</div>
					{#if form.tracked}
						<p class="muted follow">
							Puedes seguir el estado de tu mensaje desde tu cuenta.
						</p>
						<a href="/account" class="btn btn-primary">Ver mis mensajes</a>
					{:else if !data.user}
						<div class="invite">
							<h3>¿Quieres seguir el estado de tu mensaje?</h3>
							<p class="muted">
								Crea una cuenta con este mismo email y verás aquí cuándo lo hemos gestionado,
								además de tu historial de mensajes.
							</p>
							<a href="/login?next=/account" class="btn btn-primary">Crear cuenta o entrar</a>
						</div>
					{/if}
				</div>
			{:else}
				<form method="POST" enctype="multipart/form-data" use:enhance>
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
					<div class="field">
						<label for="files">Adjuntos <span class="opt">(opcional)</span></label>
						<input id="files" name="files" type="file" multiple accept={ATTACH_ACCEPT} />
						<span class="hint muted">{ATTACH_HINT}</span>
					</div>
					<button class="btn btn-primary">Enviar mensaje</button>
				</form>
			{/if}
		</div>

		<aside class="info">
			<h2>{site.name}</h2>
			<ul>
				<li><span class="lbl">Dónde</span> {contact.location}</li>
				{#if contact.address}
					<li>
						<span class="lbl">Dirección</span>
						{contact.address}
						<!-- Enlace al mapa en vez de iframe: incrustar Google Maps cargaría cookies de
						     terceros y obligaría a un banner de consentimiento. -->
						<a class="map" href="https://www.openstreetmap.org/search?query={encodeURIComponent(contact.address)}" target="_blank" rel="noopener">Ver en el mapa ↗</a>
					</li>
				{/if}
				<li><span class="lbl">Email</span> <a href="mailto:{contact.email}">{contact.email}</a></li>
				{#if contact.phone}<li><span class="lbl">Teléfono</span> <a href="tel:{contact.phone.replace(/\s/g, '')}">{contact.phone}</a></li>{/if}
				{#if contact.hours}<li><span class="lbl">Horario</span> {contact.hours}</li>{/if}
				{#if contact.instagram || contact.facebook || contact.youtube}
					<li>
						<span class="lbl">Redes</span>
						<span class="social">
							{#if contact.instagram}<a href={contact.instagram} target="_blank" rel="noopener">Instagram</a>{/if}
							{#if contact.facebook}<a href={contact.facebook} target="_blank" rel="noopener">Facebook</a>{/if}
							{#if contact.youtube}<a href={contact.youtube} target="_blank" rel="noopener">YouTube</a>{/if}
						</span>
					</li>
				{/if}
			</ul>
			<p class="muted more">
				¿Quieres asociarte? Mira <a href="/join">hazte socio</a> o las
				<a href="/faq">preguntas frecuentes</a>.
			</p>
		</aside>
	</div>
</div>

<style>
	.page { padding: 2.5rem 0; }
	.intro { max-width: 52ch; margin-top: -0.5rem; }
	.layout { display: grid; grid-template-columns: 1.4fr 1fr; gap: 2.5rem; margin-top: 2rem; align-items: start; }
	.row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
	.opt { font-weight: 400; color: var(--muted); }
	.hint { display: block; font-size: 0.8rem; margin-top: 0.35rem; font-weight: 400; }
	.sent .follow { margin: 1rem 0 0.8rem; }
	.invite { margin-top: 1.4rem; padding: 1.4rem; background: var(--surface); border: 1px solid var(--line); border-left: 3px solid var(--accent); border-radius: var(--radius); }
	.invite h3 { font-size: 1.1rem; margin-bottom: 0.4rem; }
	.invite p { margin-bottom: 1rem; }
	.hp { position: absolute; left: -9999px; width: 1px; height: 1px; }
	.info { background: var(--surface); border: 1px solid var(--line); border-radius: var(--radius); padding: 1.6rem; box-shadow: var(--shadow); }
	.info h2 { font-size: 1.3rem; margin-bottom: 1rem; }
	.info ul { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.9rem; }
	.info .lbl { display: block; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.08em; color: var(--muted); margin-bottom: 0.1rem; }
	.info a { color: var(--accent); }
	.map { display: inline-block; margin-top: 0.3rem; font-size: 0.88rem; text-decoration: underline; }
	.social { display: flex; gap: 0.8rem; flex-wrap: wrap; }
	.more { margin: 1.2rem 0 0; padding-top: 1rem; border-top: 1px solid var(--line); font-size: 0.9rem; }
	.more a { text-decoration: underline; }
	@media (max-width: 780px) {
		.layout { grid-template-columns: 1fr; }
	}
	@media (max-width: 520px) { .row { grid-template-columns: 1fr; } }
</style>
