<script lang="ts">
	import { org } from '$lib/content';
</script>

<svelte:head>
	<title>Política de cookies · Nou Art</title>
	<meta name="description" content="Qué cookies usa Nou Art y para qué." />
</svelte:head>

<div class="wrap page">
	<p class="eyebrow">Información legal</p>
	<h1>Política de cookies</h1>
	<p class="muted intro">
		Este sitio usa <strong>solo cookies técnicas necesarias</strong> para que funcione. No usamos
		cookies de analítica, publicidad ni seguimiento, y no compartimos datos con terceros. Por eso no
		verás un banner pidiéndote consentimiento: la normativa exime a las cookies estrictamente
		necesarias para prestar el servicio que has solicitado.
	</p>

	<section>
		<h2>Qué es una cookie</h2>
		<p>
			Un pequeño archivo que el sitio guarda en tu navegador para recordar información entre
			páginas, como que has iniciado sesión.
		</p>
	</section>

	<section>
		<h2>Cookies que utilizamos</h2>
		<div class="table-wrap">
			<table>
				<thead>
					<tr><th>Nombre</th><th>Finalidad</th><th>Duración</th></tr>
				</thead>
				<tbody>
					<tr>
						<td><code>nouart_session</code></td>
						<td>Mantener tu sesión iniciada como persona usuaria.</td>
						<td>30 días</td>
					</tr>
					<tr>
						<td><code>nouart_admin</code></td>
						<td>Mantener la sesión del panel de gestión (solo equipo).</td>
						<td>14 días</td>
					</tr>
					<tr>
						<td><code>nouart_v</code></td>
						<td>Identificar de forma anónima tu navegador para que no se dupliquen los "me gusta" cuando no has iniciado sesión.</td>
						<td>1 año</td>
					</tr>
				</tbody>
			</table>
		</div>
		<p class="muted small">
			Todas son cookies propias y técnicas. No contienen datos personales identificables más allá
			de lo indicado.
		</p>
	</section>

	<section>
		<h2>Almacenamiento local</h2>
		<p>
			Además guardamos en tu navegador (almacenamiento local, no es una cookie) tu preferencia de
			<strong>tema claro u oscuro</strong>, para respetarla en futuras visitas. Es información
			puramente estética y no se envía a ningún servidor.
		</p>
	</section>

	<section>
		<h2>Cómo desactivarlas</h2>
		<p>
			Puedes bloquear o eliminar las cookies desde la configuración de tu navegador. Ten en cuenta
			que, al ser técnicas, si las bloqueas no podrás iniciar sesión ni usar algunas funciones.
		</p>
	</section>

	<section>
		<h2>Cambios</h2>
		<p>
			Si en el futuro incorporamos cookies no necesarias (por ejemplo, analítica), actualizaremos
			esta página y te pediremos consentimiento previo mediante un aviso. Para cualquier duda:
			<a href="mailto:{org.email}">{org.email}</a>.
		</p>
	</section>
</div>

<style>
	.page { padding: 2.5rem 0 4rem; max-width: 720px; }
	h1 { margin-bottom: 0.6rem; }
	.intro { font-size: 1.1rem; margin-bottom: 1.8rem; }
	section { margin-bottom: 1.8rem; }
	h2 { font-size: 1.25rem; margin-bottom: 0.5rem; }
	p { line-height: 1.7; }
	a { color: var(--accent); text-decoration: underline; }
	.table-wrap { overflow-x: auto; }
	table { width: 100%; border-collapse: collapse; font-size: 0.94rem; margin: 0.8rem 0; }
	th { text-align: left; font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.06em; color: var(--muted); padding: 0 0.6rem 0.5rem; }
	td { padding: 0.6rem; border-top: 1px solid var(--line); vertical-align: top; }
	code { background: var(--surface-2); padding: 0.1rem 0.4rem; border-radius: 5px; font-size: 0.88rem; }
	.small { font-size: 0.9rem; }
</style>
