<script lang="ts">
	import { contact, site } from '$lib/content';
</script>

<svelte:head>
	<title>Términos y condiciones · Nou Art</title>
	<meta name="description" content="Términos de uso y política de privacidad de Nou Art." />
</svelte:head>

<div class="wrap page">
	<p class="eyebrow">Información legal</p>
	<h1>Términos y condiciones</h1>
	<p class="muted intro">
		Estas condiciones regulan el uso del sitio de {site.name}, asociación cultural sin ánimo de
		lucro de Nou Barris. Al usar el sitio o crear una cuenta, aceptas lo aquí descrito.
	</p>

	<section>
		<h2>1. Uso del sitio</h2>
		<p>
			{site.name} es un espacio para difundir el trabajo de sus artistas y las actividades de la
			asociación. Te comprometes a hacer un uso respetuoso del sitio y a no publicar contenido
			ilegal, ofensivo, difamatorio o que infrinja derechos de terceros.
		</p>
	</section>

	<section>
		<h2>2. Cuentas</h2>
		<p>
			Para participar puedes crear una cuenta con tu nombre y email. Eres responsable de mantener la
			confidencialidad de tu contraseña y de la actividad realizada desde tu cuenta. Puedes solicitar
			la baja y la eliminación de tus datos en cualquier momento escribiendo a
			<a href="mailto:{contact.email}">{contact.email}</a>.
		</p>
	</section>

	<section>
		<h2>3. Artistas y obra publicada</h2>
		<p>
			Las cuentas de artista se revisan y aprueban por el equipo de {site.name} antes de activarse.
			Al publicar obra, declaras ser su autor/a o disponer de los derechos necesarios para mostrarla.
			Conservas la titularidad de tu obra y concedes a {site.name} una licencia no exclusiva para
			mostrarla en el sitio y en la difusión de las actividades de la asociación. Puedes retirar tu
			obra en cualquier momento.
		</p>
	</section>

	<section>
		<h2>4. Comentarios y participación</h2>
		<p>
			Los comentarios de visitantes pueden ser moderados antes de publicarse. Nos reservamos el
			derecho de retirar cualquier contenido que incumpla estas condiciones.
		</p>
	</section>

	<section>
		<h2>5. Privacidad y datos personales</h2>
		<p>
			Tratamos los datos que nos facilitas (nombre, email y, en su caso, los de tu perfil de artista)
			con la única finalidad de gestionar tu cuenta y las actividades de la asociación. No los
			cedemos a terceros ni los usamos con fines comerciales. Puedes ejercer tus derechos de acceso,
			rectificación, supresión y oposición escribiéndonos a
			<a href="mailto:{contact.email}">{contact.email}</a>.
		</p>
	</section>

	<section>
		<h2>6. Cambios</h2>
		<p>
			Podemos actualizar estas condiciones para adaptarlas a cambios legales o de funcionamiento. La
			versión vigente será siempre la publicada en esta página.
		</p>
	</section>

	<p class="muted contact-note">
		¿Dudas? Escríbenos a <a href="mailto:{contact.email}">{contact.email}</a> o desde la
		<a href="/contact">página de contacto</a>.
	</p>
</div>

<style>
	.page { padding: 2.5rem 0 4rem; max-width: 720px; }
	h1 { margin-bottom: 0.6rem; }
	.intro { font-size: 1.1rem; margin-bottom: 2rem; }
	section { margin-bottom: 1.8rem; }
	h2 { font-size: 1.25rem; margin-bottom: 0.5rem; }
	p { line-height: 1.7; }
	a { color: var(--accent); text-decoration: underline; }
	.contact-note { margin-top: 2.5rem; padding-top: 1.5rem; border-top: 1px solid var(--line); }
</style>
