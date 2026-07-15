<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { page } from '$app/state';
	import { afterNavigate } from '$app/navigation';
	import { site, contact } from '$lib/content';
	let { children, data } = $props();
	const user = $derived(data.user);

	let theme = $state<'light' | 'dark' | null>(null);
	let menuOpen = $state(false);

	// Móvil: cuando el footer (panel oscuro) domina la pantalla, el marco y los navs se
	// funden en oscuro (texto/iconos claros) → sin banda gris lavada. Lo detecta el scroll
	// del contenedor interno (.viewport).
	let viewportEl = $state<HTMLElement>();
	let footerEl = $state<HTMLElement>();
	let atFooter = $state(false);

	// El scroll móvil ocurre dentro de .viewport (no la ventana), así que el reset de
	// scroll de SvelteKit no lo alcanza → al navegar lo llevamos arriba a mano.
	afterNavigate(() => {
		viewportEl?.scrollTo(0, 0);
	});

	$effect(() => {
		const vp = viewportEl;
		const foot = footerEl;
		if (!vp || !foot) return;
		let raf = 0;
		const check = () => {
			raf = 0;
			atFooter = foot.getBoundingClientRect().top < window.innerHeight * 0.5;
		};
		const onScroll = () => {
			if (!raf) raf = requestAnimationFrame(check);
		};
		vp.addEventListener('scroll', onScroll, { passive: true });
		check();
		return () => {
			vp.removeEventListener('scroll', onScroll);
			if (raf) cancelAnimationFrame(raf);
		};
	});

	$effect(() => {
		const saved = localStorage.getItem('nouart-theme') as 'light' | 'dark' | null;
		theme = saved;
		if (saved) document.documentElement.dataset.theme = saved;
	});

	// Bloquea el scroll del cuerpo mientras el menú a pantalla completa está abierto.
	$effect(() => {
		document.body.style.overflow = menuOpen ? 'hidden' : '';
	});

	function toggleTheme() {
		const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
		const current = theme ?? (prefersDark ? 'dark' : 'light');
		theme = current === 'dark' ? 'light' : 'dark';
		document.documentElement.dataset.theme = theme;
		localStorage.setItem('nouart-theme', theme);
	}

	let toast = $state('');
	async function share() {
		const url = page.url.href;
		if (navigator.share) {
			try {
				await navigator.share({ title: 'Nou Art', text: 'Nou Art — cultura que une a la comunidad', url });
			} catch {
				/* el usuario canceló */
			}
			return;
		}
		try {
			await navigator.clipboard.writeText(url);
			toast = 'Enlace copiado';
			setTimeout(() => (toast = ''), 2200);
		} catch {
			/* sin permiso de portapapeles */
		}
	}

	const nav = [
		{ href: '/', label: 'Inicio' },
		{ href: '/agenda', label: 'Agenda' },
		{ href: '/news', label: 'Noticias' },
		{ href: '/gallery', label: 'Galería' },
		{ href: '/artists', label: 'Artistas' },
		{ href: '/about', label: 'Acerca de' },
		{ href: '/join', label: 'Hazte socio' },
		{ href: '/contact', label: 'Contacto' }
	];
	const path = $derived(page.url.pathname);
	const isActive = (href: string) => (href === '/' ? path === '/' : path.startsWith(href));
	// En /admin la barra lateral llega hasta abajo: el margen que separa el footer del
	// contenido en las páginas normales dejaría un hueco entre ambos.
	const isAdmin = $derived(path.startsWith('/admin'));

	// Etiqueta de la sección actual para la barra superior en móvil.
	const sections = [
		{ test: (p: string) => p.startsWith('/agenda'), label: 'Agenda' },
		{ test: (p: string) => p.startsWith('/news'), label: 'Noticias' },
		{ test: (p: string) => p.startsWith('/gallery') || p.startsWith('/work'), label: 'Galería' },
		{ test: (p: string) => p.startsWith('/artist'), label: 'Artistas' },
		{ test: (p: string) => p.startsWith('/about'), label: 'Acerca de' },
		{ test: (p: string) => p.startsWith('/board'), label: 'Junta Directiva' },
		{ test: (p: string) => p.startsWith('/join'), label: 'Hazte socio' },
		{ test: (p: string) => p.startsWith('/faq'), label: 'Preguntas frecuentes' },
		{ test: (p: string) => p.startsWith('/contact'), label: 'Contacto' },
		{ test: (p: string) => p.startsWith('/admin'), label: 'Gestión' },
		{
			test: (p: string) =>
				p.startsWith('/legal') || p.startsWith('/privacy') || p.startsWith('/cookies') || p.startsWith('/terms'),
			label: 'Legal'
		}
	];
	const currentLabel = $derived(sections.find((s) => s.test(path))?.label ?? '');
	const year = new Date().getFullYear();
</script>

<svelte:window
	onkeydown={(e) => {
		if (e.key === 'Escape') menuOpen = false;
	}}
/>

<svelte:head>
	<link rel="icon" href={favicon} />
	<meta name="theme-color" content="#b23a2e" />
	<meta property="og:site_name" content="Nou Art" />
	<meta property="og:type" content="website" />
	<meta property="og:title" content="Nou Art — Cultura que une a la comunidad" />
	<meta
		property="og:description"
		content="Asociación de artistas de Nou Barris. Talleres, eventos, exposiciones y la obra de sus artistas, en abierto."
	/>
	<meta property="og:image" content="https://nouart.org/og.jpg" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:url" content={page.url.href} />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="Nou Art — Cultura que une a la comunidad" />
	<meta name="twitter:description" content="Asociación de artistas de Nou Barris, en abierto." />
	<meta name="twitter:image" content="https://nouart.org/og.jpg" />
</svelte:head>

<!-- Menú a pantalla completa -->
<div class="menu-overlay" class:open={menuOpen} role="dialog" aria-modal="true" aria-label="Menú">
	<button class="menu-close" onclick={() => (menuOpen = false)} aria-label="Cerrar menú">
		<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
			<path d="M6 6l12 12M18 6L6 18" />
		</svg>
	</button>
	<nav class="menu-nav">
		{#each nav as item (item.href)}
			<a href={item.href} class:active={isActive(item.href)} onclick={() => (menuOpen = false)}>
				{item.label}
			</a>
		{/each}
	</nav>
	<div class="menu-auth">
		{#if user}
			<a href="/account" class="ma-link" onclick={() => (menuOpen = false)}>Mi cuenta</a>
			{#if user.role === 'artist'}
				<a href="/studio" class="ma-link" onclick={() => (menuOpen = false)}>Mi estudio</a>
			{/if}
			<form method="POST" action="/logout"><button type="submit" class="ma-link ma-btn">Cerrar sesión</button></form>
		{:else}
			<a href="/login" class="ma-link ma-cta" onclick={() => (menuOpen = false)}>Entrar o crear cuenta</a>
		{/if}
	</div>
	<div class="menu-foot muted">{site.name} · {contact.location}</div>
</div>

<!-- Móvil: marco/navs = overlays anclados a los BORDES del shell (body 100dvh, no
     scrollea). El scroll ocurre en .viewport (interno) → la barra de URL queda fija; y
     aunque togglee, los overlays se anclan por bordes (top/bottom, SIN dvh en offsets)
     → cero descuadre. El footer va DENTRO del scroll (último bloque, sobre el nav).
     En escritorio .viewport es display:contents y todo fluye normal. -->
<div class="frame-glass" class:atfooter={atFooter} aria-hidden="true"></div>
<div class="frame" class:atfooter={atFooter} aria-hidden="true"></div>

<header class="site-header" class:atfooter={atFooter}>
	<div class="wrap header-inner">
		<!-- Escritorio -->
		<a href="/" class="brand">
			<img class="brand-mark" src={favicon} alt="" width="30" height="30" />
			<span class="brand-name">Nou&nbsp;Art</span>
		</a>
		<nav class="desk-nav">
			{#each nav as item (item.href)}
				<a href={item.href} class="navlink" class:active={isActive(item.href)}>{item.label}</a>
			{/each}
			<a href={user ? '/account' : '/login'} class="navlink acct" class:active={isActive('/account')}>
				{user ? 'Mi cuenta' : 'Entrar'}
			</a>
		</nav>
		<button class="icon-btn theme-desktop" onclick={toggleTheme} aria-label="Cambiar tema" title="Cambiar tema">
			{theme === 'dark' ? '☀' : '☾'}
		</button>

		<!-- Móvil: barra superior que abre el menú -->
		<button class="topbar" onclick={() => (menuOpen = true)} aria-label="Abrir menú">
			<img class="brand-mark" src={favicon} alt="" width="28" height="28" />
			<span class="topbar-title">
				Nou Art{#if currentLabel}<span class="sep">·</span>{currentLabel}{/if}
			</span>
		</button>
	</div>
</header>

<div class="viewport" bind:this={viewportEl}>
<main>
	{@render children()}
</main>

<!-- Footer: último bloque del scroll; en móvil aparece sobre el nav inferior. -->
<footer class="site-footer" class:flush={isAdmin} bind:this={footerEl}>
	<div class="wrap footer-grid">
		<div class="foot-brand">
			<div class="foot-logo">
				<img src={favicon} alt="" width="30" height="30" />
				<span>Nou Art</span>
			</div>
			<p class="muted">Asociación de artistas de Nou Barris. Arte del barrio, en abierto.</p>
		</div>
		<nav class="foot-col">
			<h4>Explorar</h4>
			<a href="/">Inicio</a>
			<a href="/agenda">Agenda</a>
			<a href="/news">Noticias</a>
			<a href="/gallery">Galería</a>
			<a href="/artists">Artistas</a>
		</nav>
		<nav class="foot-col">
			<h4>Asociación</h4>
			<a href="/about">Acerca de</a>
			<a href="/board">Junta Directiva</a>
			<a href="/join">Hazte socio</a>
			<a href="/faq">Preguntas frecuentes</a>
			<a href="/contact">Contacto</a>
		</nav>
		<nav class="foot-col">
			<h4>Legal</h4>
			<a href="/legal">Aviso legal</a>
			<a href="/privacy">Privacidad</a>
			<a href="/cookies">Cookies</a>
			<a href="/terms">Términos</a>
		</nav>
		<div class="foot-col">
			<h4>Contacto</h4>
			<span class="muted">{contact.location}</span>
			{#if contact.address}<span class="muted">{contact.address}</span>{/if}
			<a href="mailto:{contact.email}">{contact.email}</a>
			{#if contact.phone}<a href="tel:{contact.phone.replace(/\s/g, '')}">{contact.phone}</a>{/if}
			{#if contact.hours}<span class="muted">{contact.hours}</span>{/if}
			{#if contact.instagram || contact.facebook || contact.youtube}
				<span class="social">
					{#if contact.instagram}<a href={contact.instagram} target="_blank" rel="noopener">Instagram</a>{/if}
					{#if contact.facebook}<a href={contact.facebook} target="_blank" rel="noopener">Facebook</a>{/if}
					{#if contact.youtube}<a href={contact.youtube} target="_blank" rel="noopener">YouTube</a>{/if}
				</span>
			{/if}
			<a class="contact-cta" href="/contact">Escríbenos →</a>
		</div>
	</div>
	<div class="wrap foot-bottom">
		<span>© {year} Nou Art · Asociación sin ánimo de lucro</span>
		<a class="admin-link" href="/admin">Acceso gestión</a>
	</div>
</footer>
</div><!-- /.viewport -->

<!-- Móvil: barra inferior (botones circulares a la derecha) -->
<div class="mobile-bar" class:atfooter={atFooter}>
	<button class="icon-btn" onclick={toggleTheme} aria-label="Cambiar tema" title="Cambiar tema">
		{theme === 'dark' ? '☀' : '☾'}
	</button>
	<a class="icon-btn" href={user ? '/account' : '/login'} aria-label={user ? 'Mi cuenta' : 'Entrar'} title={user ? 'Mi cuenta' : 'Entrar'}>
		<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
			<circle cx="12" cy="8" r="3.4" />
			<path d="M5.5 20c1.2-3.4 3.8-5 6.5-5s5.3 1.6 6.5 5" />
		</svg>
	</a>
	<button class="icon-btn" onclick={share} aria-label="Compartir enlace" title="Compartir">
		<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
			<circle cx="18" cy="5" r="2.6" />
			<circle cx="6" cy="12" r="2.6" />
			<circle cx="18" cy="19" r="2.6" />
			<path d="M8.3 13.3l7.4 4.4M15.7 6.3l-7.4 4.4" />
		</svg>
	</button>
	<button class="icon-btn" onclick={() => (menuOpen = true)} aria-label="Abrir menú" title="Menú">
		<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
			<path d="M4 7h16M4 12h16M4 17h16" />
		</svg>
	</button>
</div>

{#if toast}<div class="toast" role="status">{toast}</div>{/if}

<style>
	.site-header {
		position: sticky; top: 0; z-index: 20;
		background: color-mix(in srgb, var(--bg) 88%, transparent);
		backdrop-filter: blur(10px);
		border-bottom: 1px solid var(--line);
	}
	.header-inner { display: flex; align-items: center; gap: 1rem; height: 66px; }
	.brand { display: flex; align-items: center; gap: 0.55rem; font-family: var(--serif); font-size: 1.35rem; font-weight: 600; }
	.brand-mark { display: block; border-radius: 8px; }
	.desk-nav { display: flex; gap: 0.35rem; margin-left: auto; }
	/* Franja intermedia (entre el móvil a 820px y el escritorio amplio): con 8 enlaces
	   + "Entrar" el nav no cabe (~1066px necesarios). Encogemos y dejamos solo el
	   logotipo para que no se desborde. */
	@media (min-width: 821px) and (max-width: 1100px) {
		.desk-nav { gap: 0.1rem; }
		.navlink { padding: 0.35rem 0.5rem; font-size: 0.88rem; }
		.brand-name { display: none; }
		.header-inner { gap: 0.6rem; }
	}
	.navlink {
		padding: 0.4rem 0.8rem; border-radius: 999px; font-size: 0.95rem; color: var(--muted);
		transition: color 0.15s, background 0.15s; white-space: nowrap;
	}
	.navlink:hover { color: var(--text); background: var(--surface-2); }
	.navlink.active { color: var(--text); background: var(--accent-soft); }
	.icon-btn {
		width: 40px; height: 40px; border-radius: 999px; border: 1px solid var(--line);
		background: var(--surface); color: var(--text); cursor: pointer; font-size: 1.1rem; line-height: 1;
		display: inline-flex; align-items: center; justify-content: center; flex: none;
	}
	.icon-btn:hover { border-color: var(--accent); }

	.toast {
		position: fixed; left: 50%; bottom: 92px; transform: translateX(-50%); z-index: 120;
		background: var(--text); color: var(--bg); padding: 0.6rem 1.15rem; border-radius: 999px;
		font-size: 0.9rem; font-weight: 500; box-shadow: var(--shadow); animation: toast-in 0.2s ease;
	}
	@keyframes toast-in { from { opacity: 0; transform: translate(-50%, 8px); } to { opacity: 1; transform: translate(-50%, 0); } }

	/* elementos sólo-móvil ocultos en escritorio */
	.topbar, .mobile-bar, .frame, .frame-glass { display: none; }
	/* En escritorio .viewport es transparente (sus hijos fluyen normal). */
	.viewport { display: contents; }

	main { min-height: 70vh; }

	/* --- Footer: panel oscuro de cierre, contrasta con el contenido --- */
	.site-footer {
		/* tokens propios del footer (fondo siempre oscuro → texto claro en ambos temas) */
		--foot-bg: #1b1813; --foot-text: #ece7dd; --foot-muted: #9c9284;
		--foot-line: rgba(255, 255, 255, 0.1); --foot-accent: #e0705f;
		background: var(--foot-bg); color: var(--foot-text);
		border-top: 3px solid var(--accent);
		margin-top: 4rem; padding: 3rem 0 1.5rem;
	}
	/* En /admin la barra lateral se estira hasta el footer: sin este margen a 0 quedaría
	   un hueco de 4rem entre ambos. */
	.site-footer.flush { margin-top: 0; }
	/* En oscuro, un pelín más profundo que la página para que se lea como "pozo" */
	@media (prefers-color-scheme: dark) { .site-footer { --foot-bg: #0d0b08; } }
	:root[data-theme='light'] .site-footer { --foot-bg: #1b1813; }
	:root[data-theme='dark'] .site-footer { --foot-bg: #0d0b08; }

	.footer-grid {
		display: grid; gap: 2rem;
		grid-template-columns: 1.5fr 1fr 1.1fr 0.8fr 1.1fr;
		padding-bottom: 2rem; border-bottom: 1px solid var(--foot-line);
	}
	.social { display: flex; gap: 0.8rem; flex-wrap: wrap; margin-top: 0.2rem; }
	/* Acceso directo a la página de contacto desde la propia columna de Contacto. */
	.contact-cta { margin-top: 0.4rem; font-weight: 600; color: var(--foot-accent); }
	.contact-cta:hover { text-decoration: underline; }
	.admin-link { color: var(--foot-muted); }
	.admin-link:hover { color: var(--foot-accent); }
	.foot-logo { display: flex; align-items: center; gap: 0.5rem; font-family: var(--serif); font-size: 1.3rem; font-weight: 600; margin-bottom: 0.6rem; color: var(--foot-text); }
	.foot-brand p { max-width: 34ch; font-size: 0.95rem; margin: 0; color: var(--foot-muted); }
	.foot-col { display: flex; flex-direction: column; gap: 0.5rem; }
	.foot-col h4 { font-family: var(--sans); font-size: 0.78rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--foot-muted); margin: 0 0 0.4rem; }
	.foot-col a, .foot-col span { font-size: 0.95rem; color: var(--foot-text); }
	.foot-col a { transition: color 0.15s; }
	.foot-col a:hover { color: var(--foot-accent); }
	.foot-bottom { display: flex; justify-content: space-between; gap: 1rem; flex-wrap: wrap; padding-top: 1.5rem; font-size: 0.88rem; color: var(--foot-muted); }

	/* --- Menú a pantalla completa --- */
	.menu-overlay {
		position: fixed; inset: 0; z-index: 100;
		background: var(--bg);
		display: flex; flex-direction: column;
		opacity: 0; visibility: hidden; transform: scale(1.015);
		transition: opacity 0.28s ease, transform 0.28s ease, visibility 0.28s;
	}
	.menu-overlay.open { opacity: 1; visibility: visible; transform: none; }
	.menu-close {
		position: absolute; top: 1.1rem; left: 1.1rem;
		width: 46px; height: 46px; border-radius: 999px; border: 1px solid var(--line);
		background: var(--surface); color: var(--text); cursor: pointer;
		display: inline-flex; align-items: center; justify-content: center;
	}
	.menu-close:hover { border-color: var(--accent); color: var(--accent); }
	.menu-nav { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.4rem; }
	.menu-nav a {
		font-family: var(--serif); font-size: clamp(2rem, 8vw, 2.8rem); font-weight: 600;
		color: var(--muted); padding: 0.35rem 1rem; line-height: 1.2;
		opacity: 0; transform: translateY(12px);
		transition: color 0.15s, opacity 0.35s ease, transform 0.35s ease;
	}
	.menu-nav a:hover, .menu-nav a.active { color: var(--accent); }
	.menu-overlay.open .menu-nav a { opacity: 1; transform: none; }
	.menu-overlay.open .menu-nav a:nth-child(1) { transition-delay: 0.06s; }
	.menu-overlay.open .menu-nav a:nth-child(2) { transition-delay: 0.11s; }
	.menu-overlay.open .menu-nav a:nth-child(3) { transition-delay: 0.16s; }
	.menu-overlay.open .menu-nav a:nth-child(4) { transition-delay: 0.21s; }
	.menu-overlay.open .menu-nav a:nth-child(5) { transition-delay: 0.26s; }
	.menu-auth { display: flex; flex-wrap: wrap; justify-content: center; gap: 0.4rem 1.4rem; padding: 0.5rem 1rem 0.2rem; }
	.menu-auth .ma-link {
		font-family: var(--sans); font-size: 1rem; color: var(--muted); font-weight: 500;
		background: none; border: 0; cursor: pointer; padding: 0.3rem 0; font: inherit;
	}
	.menu-auth .ma-link:hover { color: var(--accent); }
	.menu-auth .ma-cta { color: var(--accent); font-weight: 600; }
	.menu-auth .ma-btn { font-size: 1rem; }
	.menu-auth form { margin: 0; }
	.acct { color: var(--text); border: 1px solid var(--line); font-weight: 600; }
	.acct:hover { border-color: var(--accent); background: var(--accent-soft); }
	.menu-foot { text-align: center; padding: 1.2rem 1.5rem 1.5rem; font-size: 0.9rem; }

	@media (prefers-reduced-motion: reduce) {
		.menu-overlay, .menu-nav a { transition: opacity 0.15s ease, visibility 0.15s; transform: none !important; }
	}

	/* ===================== MÓVIL: shell fijo (app) ===================== */
	@media (max-width: 820px) {
		.brand, .desk-nav, .theme-desktop { display: none; }

		/* La RAÍZ es el shell fijo de 100dvh y NO scrollea → la barra de URL queda fija.
		   Marco y navs se anclan a los BORDES del shell (top/bottom), SIN dvh en offsets →
		   aunque la barra togglee, todo re-ancla junto: cero descuadre. */
		/* html no scrollea aquí, así que anulamos el scrollbar-gutter:stable del CSS base:
		   un elemento con overflow:hidden sigue siendo contenedor de scroll y reservaría
		   una franja muerta (~15px) en navegadores con barra clásica. */
		:global(html) { overflow: hidden; scrollbar-gutter: auto; }
		:global(body) { height: 100dvh; overflow: hidden; position: relative; }

		/* .viewport = ÚNICO contenedor scrolleable (scroll interno). El footer es su último
		   bloque. flex-column + main flex:1 → en páginas cortas el footer baja al fondo.
		   scrollbar-gutter:stable → el ancho del contenido NO cambia haya scroll o no
		   (en móvil la barra es overlay y no reserva nada, así que sale gratis). */
		.viewport {
			display: flex; flex-direction: column; position: absolute; inset: 0;
			overflow-y: auto; -webkit-overflow-scrolling: touch; overscroll-behavior: contain;
			scrollbar-gutter: stable;
		}

		/* ENVOLTURA ÚNICA de cristal: overlay anclado a los bordes del shell (inset:0, SIN
		   dvh). Recortada (padding + mask-composite:exclude) → borde = nav sup (60) + nav
		   inf (74) + paredes (14), TODO el mismo cristal, un solo backdrop-filter, sin
		   costuras. Fija sobre el scroll: el contenido pasa por debajo y se desenfoca. */
		.frame-glass {
			display: block; position: absolute; inset: 0; z-index: 5; pointer-events: none;
			padding: 60px 14px 74px 14px;
			/* Cristal claro frosted sobre el contenido (muestra el arte difuminado). */
			background: color-mix(in srgb, var(--bg) 72%, transparent);
			-webkit-backdrop-filter: blur(16px) saturate(1.2);
			backdrop-filter: blur(16px) saturate(1.2);
			-webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
			-webkit-mask-composite: xor;
			mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
			mask-composite: exclude;
			transition: background 0.3s ease;
		}
		/* Al llegar al footer, el cristal se funde en OSCURO con el panel (mismo tono del
		   footer) → sin banda gris lavada; el marco/nav quedan integrados con el footer. */
		.frame-glass.atfooter { background: color-mix(in srgb, #17140f 62%, transparent); }

		/* Línea del borde interior (esquinas curvas). El ::after ocupa el hueco central. */
		.frame {
			display: block; position: absolute; inset: 0; z-index: 6; pointer-events: none;
			padding: 60px 14px 74px 14px;
		}
		.frame::after {
			content: ''; display: block; height: 100%;
			border: 1px solid var(--line); border-radius: 16px;
			transition: border-color 0.3s ease;
		}
		.frame.atfooter::after { border-color: rgba(255, 255, 255, 0.14); }

		/* barra superior: overlay anclado arriba, SIN cristal propio (lo pone la envoltura). */
		.site-header {
			position: absolute; top: 0; left: 0; right: 0; z-index: 20; height: 60px;
			border-bottom: 0; pointer-events: auto;
			background: none; -webkit-backdrop-filter: none; backdrop-filter: none;
		}
		/* En el footer, título e iconos en claro para contrastar con el cristal oscuro. */
		.site-header .topbar { transition: color 0.3s ease; }
		.site-header.atfooter .topbar { color: #ece7dd; }
		.site-header.atfooter .sep { color: rgba(236, 231, 221, 0.55); }
		.mobile-bar .icon-btn { transition: color 0.3s ease, border-color 0.3s ease, background 0.3s ease; }
		.mobile-bar.atfooter .icon-btn {
			color: #ece7dd; background: rgba(255, 255, 255, 0.08); border-color: rgba(255, 255, 255, 0.22);
		}
		.header-inner { height: 60px; }
		.topbar {
			display: flex; align-items: center; gap: 0.6rem; width: 100%;
			background: none; border: 0; cursor: pointer; padding: 0.3rem 0; color: var(--text);
			font-family: var(--serif); font-size: 1.25rem; font-weight: 600;
		}
		.topbar-title { display: inline-flex; align-items: baseline; }
		.sep { color: var(--muted); font-weight: 400; margin: 0 0.45rem; }

		/* barra inferior: overlay anclado abajo, transparente (cristal de la envoltura). */
		.mobile-bar {
			position: absolute; bottom: 0; left: 0; right: 0; z-index: 20; height: 74px;
			pointer-events: auto;
			display: flex; align-items: center; justify-content: flex-end; gap: 0.6rem;
			padding: 0 1rem;
			background: none; -webkit-backdrop-filter: none; backdrop-filter: none; border-top: 0;
		}
		/* botones del nav inferior del mismo tamaño que la X del menú (46px) */
		.mobile-bar .icon-btn { width: 46px; height: 46px; font-size: 1.35rem; }

		/* contenido: hueco para el nav superior (78) + gutter lateral */
		main { flex: 1 0 auto; padding: 78px 1.7rem 1.4rem; }
		main :global(.wrap) { padding-left: 0; padding-right: 0; }

		/* footer: fondo oscuro a ANCHO COMPLETO (se extiende tras las paredes y el nav →
		   el cristal lo muestra difuminado). El padding del contenido lo mantiene fuera
		   del marco (lados) y del nav inferior (abajo) para que nada quede tapado. */
		.site-footer { margin-top: 0; padding: 2.4rem 0 6.5rem; }
		.site-footer :global(.wrap) { padding-left: 2.1rem; padding-right: 2.1rem; }
	}

	/* Footer responsive: dos columnas en móvil (marca a ancho completo). */
	@media (max-width: 720px) {
		.footer-grid { grid-template-columns: 1fr 1fr; gap: 1.6rem 1.2rem; }
		.foot-brand { grid-column: 1 / -1; }
	}
</style>
