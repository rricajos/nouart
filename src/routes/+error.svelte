<script lang="ts">
	import { page } from '$app/state';
	import favicon from '$lib/assets/favicon.svg';

	const is404 = $derived(page.status === 404);
	const title = $derived(is404 ? 'No encontramos esta página' : 'Algo ha ido mal');
	const message = $derived(
		is404
			? 'La página que buscas no existe o se ha movido. Puede que el enlace esté anticuado.'
			: (page.error?.message ?? 'Ha ocurrido un error inesperado. Prueba de nuevo en un momento.')
	);
</script>

<svelte:head>
	<title>{title} · Nou Art</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="wrap err">
	<img class="mark" src={favicon} alt="" width="56" height="56" />
	<p class="code">{page.status}</p>
	<h1>{title}</h1>
	<p class="muted msg">{message}</p>
	<div class="cta">
		<a href="/" class="btn btn-primary">Volver al inicio</a>
		<a href="/gallery" class="btn">Ver la galería</a>
	</div>
	<p class="help muted">
		Si crees que es un fallo, escríbenos desde <a href="/contact">contacto</a>.
	</p>
</div>

<style>
	.err { max-width: 520px; padding: 4rem 1.25rem 5rem; text-align: center; }
	.mark { display: block; margin: 0 auto 1.2rem; border-radius: 12px; }
	.code { font-family: var(--serif); font-size: 3.2rem; font-weight: 700; color: var(--accent); line-height: 1; margin: 0 0 0.3rem; }
	h1 { margin-bottom: 0.5rem; }
	.msg { font-size: 1.1rem; max-width: 40ch; margin: 0 auto 1.8rem; }
	.cta { display: flex; gap: 0.7rem; justify-content: center; flex-wrap: wrap; }
	.help { margin-top: 2rem; font-size: 0.92rem; }
	.help a { color: var(--accent); text-decoration: underline; }
</style>
