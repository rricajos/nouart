<script lang="ts">
	import { enhance } from '$app/forms';
	import { fly } from 'svelte/transition';
	import { page } from '$app/state';
	import { contact, site, contactTopics, topicById } from '$lib/content';
	import SocialIcons from '$lib/components/SocialIcons.svelte';
	import {
		ATTACH_HINT,
		ATTACH_ACCEPT,
		ATTACH_EXTS,
		ATTACH_MAX_BYTES,
		ATTACH_MAX_FILES
	} from '$lib/uploads-limits';
	let { data, form } = $props();

	// Paso 1: el tema se elige antes de escribir → fija el asunto y permite filtrar los
	// mensajes en el panel. Va en la URL (?topic=…) en vez de en estado local: así las
	// tarjetas son enlaces reales (funciona sin JS), se puede enlazar directo desde otras
	// páginas y el tema sobrevive a un error de validación.
	const chosen = $derived(topicById(page.url.searchParams.get('topic')));
	const topic = $derived(chosen?.id ?? null);

	// Zona de adjuntos: el <input type=file> real queda oculto pero sigue siendo el que
	// envía el formulario; aquí solo gestionamos la lista y la sincronizamos con él.
	let inputEl = $state<HTMLInputElement>();
	let picked = $state<File[]>([]);
	let dragOver = $state(false);
	let fileError = $state('');

	const fmtSize = (b: number) =>
		b < 1024 * 1024 ? `${Math.round(b / 1024)} KB` : `${(b / 1024 / 1024).toFixed(1)} MB`;

	/** Mismas reglas que el servidor, aquí solo para avisar antes de enviar. */
	function addFiles(list: File[]) {
		fileError = '';
		const next = [...picked];
		for (const f of list) {
			const ext = '.' + (f.name.split('.').pop() ?? '').toLowerCase();
			if (!ATTACH_EXTS.includes(ext)) {
				fileError = `"${f.name}": solo se admiten imágenes o PDF.`;
				continue;
			}
			if (f.size > ATTACH_MAX_BYTES) {
				fileError = `"${f.name}" supera los 8 MB.`;
				continue;
			}
			if (next.length >= ATTACH_MAX_FILES) {
				fileError = `Puedes adjuntar como máximo ${ATTACH_MAX_FILES} archivos.`;
				break;
			}
			if (!next.some((x) => x.name === f.name && x.size === f.size)) next.push(f);
		}
		picked = next;
		syncInput();
	}

	function removeAt(i: number) {
		picked = picked.filter((_, j) => j !== i);
		fileError = '';
		syncInput();
	}

	/** Vuelca la lista al input real para que viaje en el envío. */
	function syncInput() {
		const dt = new DataTransfer();
		for (const f of picked) dt.items.add(f);
		if (inputEl) inputEl.files = dt.files;
	}

	function onDrop(e: DragEvent) {
		e.preventDefault();
		dragOver = false;
		addFiles(Array.from(e.dataTransfer?.files ?? []));
	}
</script>

<svelte:head>
	<title>Contacto — Nou Art</title>
	<meta name="description" content="Ponte en contacto con Nou Art, asociación cultural de Nou Barris." />
</svelte:head>

<div class="wrap page">
	<p class="eyebrow">Hablemos</p>
	<h1>Contacto</h1>
	{#if !form?.sent && !topic}
		<!-- Paso 1: elegir tema -->
		<div in:fly={{ y: 8, duration: 220 }}>
			<p class="intro muted">
				¿Sobre qué quieres hablarnos? Elige un tema y tu mensaje llegará mejor clasificado.
			</p>
			<div class="topics">
				{#each contactTopics as t (t.id)}
					<a class="tcard" href="/contact?topic={t.id}">
						<span class="tc-ico">
							<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
								{#if t.icon === 'socio'}
									<circle cx="9" cy="8" r="3.4" /><path d="M2.5 20c1.2-3.4 3.6-5 6.5-5s5.3 1.6 6.5 5" /><path d="M19 7.5v5M21.5 10h-5" />
								{:else if t.icon === 'agenda'}
									<rect x="3" y="5" width="18" height="16" rx="2" /><path d="M8 3v4M16 3v4M3 11h18" />
								{:else if t.icon === 'artista'}
									<rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" />
								{:else if t.icon === 'proyecto'}
									<path d="M9 18h6M10 21.5h4" /><path d="M12 2.5a6.5 6.5 0 0 0-3.8 11.8V17h7.6v-2.7A6.5 6.5 0 0 0 12 2.5z" />
								{:else if t.icon === 'colaborar'}
									<circle cx="8.5" cy="8" r="3.2" /><path d="M2 20c1.1-3.2 3.4-4.8 6.5-4.8s5.4 1.6 6.5 4.8" /><path d="M16.5 4.6a3.2 3.2 0 0 1 0 6.3M18 15.4c2 .7 3.3 2 4 4.1" />
								{:else}
									<path d="M20.5 12a7.5 7.5 0 0 1-7.5 7.5H8l-4.5 3v-6A7.5 7.5 0 0 1 11 4.5h2A7.5 7.5 0 0 1 20.5 12z" />
								{/if}
							</svg>
						</span>
						<span class="tc-label">{t.label}</span>
						<span class="tc-desc muted">{t.desc}</span>
						<span class="tc-go">Continuar →</span>
					</a>
				{/each}
			</div>
		</div>
	{:else}
	<div class="layout" in:fly={{ y: 8, duration: 220 }}>
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
				{#if chosen}
					<div class="chosen">
						<span class="ch-txt">Tema: <strong>{chosen.label}</strong></span>
						<a class="ch-change" href="/contact">Cambiar</a>
					</div>
				{/if}
				<form method="POST" enctype="multipart/form-data" use:enhance>
					{#if form?.error}<div class="flash flash-err">{form.error}</div>{/if}
					<input type="text" name="website" class="hp" tabindex="-1" autocomplete="off" />
					<input type="hidden" name="topic" value={topic ?? ''} />
					<!-- Marca de tiempo firmada: delata los envíos automáticos sin molestar. -->
					<input type="hidden" name="ts" value={data.formToken} />
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
						<span class="lbl">Adjuntos <span class="opt">(opcional)</span></span>
						<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
						<label
							class="drop"
							class:over={dragOver}
							ondragover={(e) => { e.preventDefault(); dragOver = true; }}
							ondragleave={() => (dragOver = false)}
							ondrop={onDrop}
						>
							<input
								bind:this={inputEl}
								id="files"
								name="files"
								type="file"
								multiple
								accept={ATTACH_ACCEPT}
								onchange={(e) => addFiles(Array.from(e.currentTarget.files ?? []))}
							/>
							<svg class="drop-ico" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
								<path d="M12 16V4" />
								<path d="M8 8l4-4 4 4" />
								<path d="M4 16v2.5A1.5 1.5 0 0 0 5.5 20h13a1.5 1.5 0 0 0 1.5-1.5V16" />
							</svg>
							<span class="drop-main">Arrastra tus archivos o <strong>haz clic para elegir</strong></span>
							<span class="drop-hint muted">{ATTACH_HINT}</span>
						</label>

						{#if fileError}<p class="file-err">{fileError}</p>{/if}

						{#if picked.length}
							<ul class="files">
								{#each picked as f, i (f.name + f.size)}
									<li>
										<span class="f-name">{f.name}</span>
										<span class="f-size muted">{fmtSize(f.size)}</span>
										<button type="button" class="f-del" onclick={() => removeAt(i)} aria-label="Quitar {f.name}">
											<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true">
												<path d="M6 6l12 12M18 6L6 18" />
											</svg>
										</button>
									</li>
								{/each}
							</ul>
						{/if}
					</div>
					<label class="human">
						<input type="checkbox" name="human" required />
						<span>Confirmo que no soy un robot</span>
					</label>

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
				<li>
					<span class="lbl">Redes</span>
					<SocialIcons />
				</li>
			</ul>
			<p class="muted more">
				¿Quieres asociarte? Mira <a href="/join">hazte socio</a> o las
				<a href="/faq">preguntas frecuentes</a>.
			</p>
		</aside>
	</div>
	{/if}
</div>

<style>
	.page { padding: 2.5rem 0; }
	.intro { max-width: 52ch; margin-top: -0.5rem; }
	.layout { display: grid; grid-template-columns: 1.4fr 1fr; gap: 2.5rem; margin-top: 2rem; align-items: start; }
	.row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
	.opt { font-weight: 400; color: var(--muted); }
	.lbl { display: block; font-size: 0.85rem; font-weight: 600; margin: 0 0 0.3rem; color: var(--muted); }

	/* Paso 1: tarjetas de tema */
	/* 3 columnas fijas → los 6 temas quedan 3+3. Con auto-fit entraban 5 y dejaban la
	   última tarjeta huérfana en una segunda fila. */
	.topics { display: grid; gap: 1rem; grid-template-columns: repeat(3, 1fr); margin-top: 2rem; }
	@media (max-width: 900px) { .topics { grid-template-columns: repeat(2, 1fr); } }
	@media (max-width: 560px) { .topics { grid-template-columns: 1fr; } }
	.tcard {
		display: flex; flex-direction: column; gap: 0.3rem; text-align: left; cursor: pointer;
		font: inherit; padding: 1.4rem; border-radius: var(--radius);
		border: 1px solid var(--line); background: var(--surface); box-shadow: var(--shadow);
		transition: border-color 0.15s, transform 0.15s, box-shadow 0.15s;
	}
	.tcard:hover { border-color: var(--accent); transform: translateY(-3px); box-shadow: 0 12px 30px rgba(0,0,0,.12); }
	.tcard:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
	.tc-ico {
		display: inline-flex; align-items: center; justify-content: center;
		width: 40px; height: 40px; border-radius: 10px; margin-bottom: 0.5rem;
		background: var(--accent-soft); color: var(--accent);
		transition: background 0.15s, color 0.15s;
	}
	.tcard:hover .tc-ico { background: var(--accent); color: #fff; }
	.tc-label { font-family: var(--serif); font-size: 1.15rem; font-weight: 600; color: var(--text); }
	.tc-desc { font-size: 0.88rem; line-height: 1.45; }
	/* mt:auto → el "Continuar" queda alineado abajo aunque las descripciones midan distinto */
	.tc-go { margin-top: auto; padding-top: 0.7rem; font-size: 0.85rem; font-weight: 600; color: var(--accent); }

	/* Paso 2: tema elegido */
	.chosen { display: flex; align-items: center; justify-content: space-between; gap: 1rem; background: var(--accent-soft); border: 1px solid var(--accent); border-radius: 10px; padding: 0.6rem 0.9rem; margin-bottom: 1.2rem; font-size: 0.92rem; }
	.ch-change { font: inherit; font-size: 0.88rem; color: var(--accent); background: none; border: 0; cursor: pointer; text-decoration: underline; flex: none; }

	/* Zona de adjuntos: el input real está oculto pero sigue siendo focusable y es el
	   que envía los archivos (sin JS, el label abre el selector igual). */
	.drop {
		position: relative; display: flex; flex-direction: column; align-items: center; gap: 0.2rem;
		padding: 1.4rem 1rem; text-align: center; cursor: pointer;
		border: 1.5px dashed var(--line); border-radius: var(--radius); background: var(--surface-2);
		transition: border-color 0.15s, background 0.15s, color 0.15s;
	}
	.drop:hover, .drop.over, .drop:focus-within { border-color: var(--accent); background: var(--accent-soft); }
	.drop input { position: absolute; width: 1px; height: 1px; opacity: 0; }
	.drop-ico { color: var(--accent); margin-bottom: 0.2rem; }
	.drop-main { font-size: 0.95rem; color: var(--text); }
	.drop-main strong { color: var(--accent); }
	.drop-hint { font-size: 0.8rem; }

	/* Casilla anti-robot: zona de toque amplia y legible (público poco técnico). */
	.human {
		display: flex; align-items: center; gap: 0.7rem; cursor: pointer;
		margin: 1.4rem 0 1.2rem; padding: 0.9rem 1rem; font-size: 0.98rem; font-weight: 500;
		background: var(--surface); border: 1px solid var(--line); border-radius: 10px;
		transition: border-color 0.15s;
	}
	.human:hover, .human:focus-within { border-color: var(--accent); }
	.human input { width: 20px; height: 20px; flex: none; accent-color: var(--accent); }

	.file-err { margin: 0.6rem 0 0; font-size: 0.88rem; color: #c0392b; }
	.files { list-style: none; padding: 0; margin: 0.7rem 0 0; display: flex; flex-direction: column; gap: 0.4rem; }
	.files li { display: flex; align-items: center; gap: 0.6rem; background: var(--surface); border: 1px solid var(--line); border-radius: 8px; padding: 0.45rem 0.6rem 0.45rem 0.8rem; font-size: 0.9rem; }
	.f-name { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
	.f-size { font-size: 0.8rem; flex: none; }
	.f-del { flex: none; display: inline-flex; align-items: center; justify-content: center; width: 24px; height: 24px; border-radius: 999px; border: 1px solid var(--line); background: none; color: var(--muted); cursor: pointer; }
	.f-del:hover { border-color: #c0392b; color: #c0392b; }
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
	.more { margin: 1.2rem 0 0; padding-top: 1rem; border-top: 1px solid var(--line); font-size: 0.9rem; }
	.more a { text-decoration: underline; }
	@media (max-width: 780px) {
		.layout { grid-template-columns: 1fr; }
	}
	@media (max-width: 520px) { .row { grid-template-columns: 1fr; } }
</style>
