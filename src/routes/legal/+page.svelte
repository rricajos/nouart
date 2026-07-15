<script lang="ts">
	import { site, org, orgReady } from '$lib/content';
</script>

<svelte:head>
	<title>Aviso legal · Nou Art</title>
	<meta name="description" content="Aviso legal e información identificativa de Nou Art." />
</svelte:head>

<div class="wrap page">
	<p class="eyebrow">Información legal</p>
	<h1>Aviso legal</h1>

	{#if !orgReady}
		<p class="pending">
			Estamos completando los datos identificativos de la asociación (nombre legal, NIF, domicilio
			social y registro). Esta página se actualizará en breve.
		</p>
	{/if}

	<section>
		<h2>1. Titular del sitio</h2>
		<p>
			En cumplimiento de la Ley 34/2002 de Servicios de la Sociedad de la Información y de Comercio
			Electrónico (LSSI-CE), se informa de los datos identificativos del titular de este sitio web:
		</p>
		<ul class="data">
			<li><strong>Denominación:</strong> {org.legalName || 'pendiente de completar'}</li>
			<li><strong>NIF:</strong> {org.nif || 'pendiente de completar'}</li>
			<li><strong>Domicilio social:</strong> {org.address || 'pendiente de completar'}</li>
			<li><strong>Registro:</strong> {org.registry || 'pendiente de completar'}</li>
			<li><strong>Email:</strong> <a href="mailto:{org.email}">{org.email}</a></li>
			<li><strong>Sitio web:</strong> nouart.org</li>
		</ul>
		<p class="muted small">
			{site.name} es una asociación cultural sin ánimo de lucro.
		</p>
	</section>

	<section>
		<h2>2. Objeto</h2>
		<p>
			Este sitio tiene por objeto difundir la actividad de la asociación, su agenda de actividades y
			la obra de las personas artistas que forman parte del colectivo, así como facilitar el
			contacto y la participación de la ciudadanía.
		</p>
	</section>

	<section>
		<h2>3. Condiciones de uso</h2>
		<p>
			El acceso al sitio es gratuito y implica la aceptación de este aviso legal y de los
			<a href="/terms">términos y condiciones</a>. La persona usuaria se compromete a hacer un uso
			lícito y respetuoso del sitio y de sus contenidos.
		</p>
	</section>

	<section>
		<h2>4. Propiedad intelectual</h2>
		<p>
			Las obras publicadas pertenecen a sus autoras y autores, que conservan todos sus derechos y
			autorizan a la asociación a mostrarlas en este sitio. El resto de contenidos (textos, marca,
			diseño) pertenecen a la asociación. No está permitida su reproducción sin autorización.
		</p>
	</section>

	<section>
		<h2>5. Responsabilidad</h2>
		<p>
			La asociación no se responsabiliza del uso que terceros puedan hacer de la información
			publicada, ni del contenido de sitios externos enlazados. Se procura mantener la información
			actualizada y libre de errores, pero no puede garantizarse la ausencia de estos.
		</p>
	</section>

	<section>
		<h2>6. Protección de datos</h2>
		<p>
			El tratamiento de datos personales se describe en la
			<a href="/privacy">política de privacidad</a>. El uso de cookies se detalla en la
			<a href="/cookies">política de cookies</a>.
		</p>
	</section>

	<section>
		<h2>7. Legislación aplicable</h2>
		<p>
			Este aviso legal se rige por la legislación española. Para cualquier controversia serán
			competentes los juzgados y tribunales que correspondan conforme a derecho.
		</p>
	</section>
</div>

<style>
	.page { padding: 2.5rem 0 4rem; max-width: 720px; }
	h1 { margin-bottom: 1.6rem; }
	.pending { background: var(--accent-soft); border: 1px solid var(--accent); border-radius: 10px; padding: 0.8rem 1rem; font-size: 0.95rem; margin-bottom: 1.8rem; }
	section { margin-bottom: 1.8rem; }
	h2 { font-size: 1.25rem; margin-bottom: 0.5rem; }
	p { line-height: 1.7; }
	a { color: var(--accent); text-decoration: underline; }
	.data { list-style: none; padding: 0; margin: 0.8rem 0; }
	.data li { padding: 0.35rem 0; border-bottom: 1px solid var(--line); font-size: 0.96rem; }
	.small { font-size: 0.9rem; margin-top: 0.8rem; }
</style>
