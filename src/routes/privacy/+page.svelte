<script lang="ts">
	import { org, orgReady } from '$lib/content';
</script>

<svelte:head>
	<title>Política de privacidad · Nou Art</title>
	<meta name="description" content="Cómo trata Nou Art tus datos personales." />
</svelte:head>

<div class="wrap page">
	<p class="eyebrow">Información legal</p>
	<h1>Política de privacidad</h1>
	<p class="muted intro">
		En Nou Art tratamos los datos que nos facilitas con el único fin de gestionar tu relación con la
		asociación. No los vendemos, no los cedemos a terceros con fines comerciales y no hacemos
		perfilado ni publicidad.
	</p>

	{#if !orgReady}
		<p class="pending">
			Estamos completando los datos identificativos del responsable del tratamiento. Esta página se
			actualizará en breve.
		</p>
	{/if}

	<section>
		<h2>Responsable del tratamiento</h2>
		<ul class="data">
			<li><strong>Responsable:</strong> {org.legalName || 'pendiente de completar'}</li>
			<li><strong>NIF:</strong> {org.nif || 'pendiente de completar'}</li>
			<li><strong>Dirección:</strong> {org.address || 'pendiente de completar'}</li>
			<li><strong>Contacto:</strong> <a href="mailto:{org.email}">{org.email}</a></li>
		</ul>
	</section>

	<section>
		<h2>Qué datos tratamos y para qué</h2>
		<ul class="bullets">
			<li>
				<strong>Cuenta de usuario</strong> (nombre, email, contraseña cifrada): para crear y
				gestionar tu cuenta, permitirte comentar y guardar obras favoritas.
			</li>
			<li>
				<strong>Cuenta de artista</strong> (además: biografía, disciplina, enlaces, imagen): para
				publicar tu perfil y tu obra en el sitio, previa aprobación del equipo.
			</li>
			<li>
				<strong>Formularios de contacto</strong> (nombre, email, mensaje): para responderte y
				gestionar tu consulta.
			</li>
			<li>
				<strong>Comentarios</strong> (nombre y texto): para publicarlos junto a la obra
				correspondiente.
			</li>
		</ul>
	</section>

	<section>
		<h2>Base legal</h2>
		<p>
			Tu <strong>consentimiento</strong> al crear la cuenta, comentar o escribirnos, y el
			<strong>interés legítimo</strong> de la asociación en difundir su actividad. Puedes retirar tu
			consentimiento en cualquier momento.
		</p>
	</section>

	<section>
		<h2>Conservación</h2>
		<p>
			Conservamos tus datos mientras mantengas la cuenta o mientras sean necesarios para la
			finalidad por la que nos los diste. Si solicitas la baja, los eliminamos salvo que debamos
			conservarlos por obligación legal.
		</p>
	</section>

	<section>
		<h2>Destinatarios</h2>
		<p>
			No cedemos tus datos a terceros. El sitio se aloja en un servidor gestionado por el equipo
			técnico de la asociación. Para el envío de correos (verificación, avisos) podemos usar un
			proveedor de email, que actúa como encargado del tratamiento.
		</p>
	</section>

	<section>
		<h2>Tus derechos</h2>
		<p>
			Puedes ejercer los derechos de <strong>acceso, rectificación, supresión, oposición,
			limitación y portabilidad</strong> escribiéndonos a
			<a href="mailto:{org.email}">{org.email}</a>. También puedes reclamar ante la Agencia Española
			de Protección de Datos (<a href="https://www.aepd.es" target="_blank" rel="noopener">aepd.es</a>)
			si consideras que no hemos atendido tu solicitud correctamente.
		</p>
	</section>

	<section>
		<h2>Seguridad</h2>
		<p>
			Las contraseñas se guardan cifradas (nunca en claro) y el sitio funciona íntegramente sobre
			conexión segura (HTTPS).
		</p>
	</section>

	<section>
		<h2>Cookies</h2>
		<p>
			Solo usamos cookies técnicas necesarias. Lo detallamos en la
			<a href="/cookies">política de cookies</a>.
		</p>
	</section>
</div>

<style>
	.page { padding: 2.5rem 0 4rem; max-width: 720px; }
	h1 { margin-bottom: 0.6rem; }
	.intro { font-size: 1.1rem; margin-bottom: 1.8rem; }
	.pending { background: var(--accent-soft); border: 1px solid var(--accent); border-radius: 10px; padding: 0.8rem 1rem; font-size: 0.95rem; margin-bottom: 1.8rem; }
	section { margin-bottom: 1.8rem; }
	h2 { font-size: 1.25rem; margin-bottom: 0.5rem; }
	p { line-height: 1.7; }
	a { color: var(--accent); text-decoration: underline; }
	.data { list-style: none; padding: 0; margin: 0.8rem 0; }
	.data li { padding: 0.35rem 0; border-bottom: 1px solid var(--line); font-size: 0.96rem; }
	.bullets { padding-left: 1.1rem; }
	.bullets li { margin-bottom: 0.6rem; line-height: 1.6; }
</style>
