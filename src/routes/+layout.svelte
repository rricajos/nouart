<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { page } from '$app/state';
	import { site, contact } from '$lib/content';
	let { children } = $props();

	let theme = $state<'light' | 'dark' | null>(null);
	let menuOpen = $state(false);

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

	const nav = [
		{ href: '/', label: 'Inicio' },
		{ href: '/galeria', label: 'Galería' },
		{ href: '/artistas', label: 'Artistas' },
		{ href: '/sobre', label: 'Sobre' },
		{ href: '/contacto', label: 'Contacto' }
	];
	const path = $derived(page.url.pathname);
	const isActive = (href: string) => (href === '/' ? path === '/' : path.startsWith(href));

	// Etiqueta de la sección actual para la barra superior en móvil.
	const sections = [
		{ test: (p: string) => p.startsWith('/galeria') || p.startsWith('/obra'), label: 'Galería' },
		{ test: (p: string) => p.startsWith('/artistas') || p.startsWith('/artista'), label: 'Artistas' },
		{ test: (p: string) => p.startsWith('/sobre'), label: 'Sobre' },
		{ test: (p: string) => p.startsWith('/contacto'), label: 'Contacto' },
		{ test: (p: string) => p.startsWith('/admin'), label: 'Gestión' }
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
	<div class="menu-foot muted">{site.name} · {contact.location}</div>
</div>

<header class="site-header">
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
		</nav>
		<button class="icon-btn theme-desktop" onclick={toggleTheme} aria-label="Cambiar tema" title="Cambiar tema">
			{theme === 'dark' ? '☀' : '☾'}
		</button>

		<!-- Móvil: barra superior que abre el menú -->
		<button class="topbar" onclick={() => (menuOpen = true)} aria-label="Abrir menú">
			<img class="brand-mark" src={favicon} alt="" width="28" height="28" />
			<span class="topbar-title">
				Nou Art{#if currentLabel}<span class="sep"> · </span>{currentLabel}{/if}
			</span>
		</button>
	</div>
</header>

<main>
	{@render children()}
</main>

<footer class="site-footer">
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
			<a href="/galeria">Galería</a>
			<a href="/artistas">Artistas</a>
		</nav>
		<nav class="foot-col">
			<h4>Asociación</h4>
			<a href="/sobre">Sobre nosotros</a>
			<a href="/contacto">Contacto</a>
			<a href="/admin">Acceso gestión</a>
		</nav>
		<div class="foot-col">
			<h4>Contacto</h4>
			<span class="muted">{contact.location}</span>
			<a href="mailto:{contact.email}">{contact.email}</a>
		</div>
	</div>
	<div class="wrap foot-bottom">
		<span>© {year} Nou Art · Asociación sin ánimo de lucro</span>
		<span class="muted">Nou Barris, Barcelona</span>
	</div>
</footer>

<!-- Móvil: barra inferior (tema + menú) -->
<div class="mobile-bar">
	<button class="bar-btn" onclick={toggleTheme} aria-label="Cambiar tema">
		<span class="bar-ico">{theme === 'dark' ? '☀' : '☾'}</span>
		<span>{theme === 'dark' ? 'Claro' : 'Oscuro'}</span>
	</button>
	<button class="bar-btn" onclick={() => (menuOpen = true)} aria-label="Abrir menú">
		<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
			<path d="M4 7h16M4 12h16M4 17h16" />
		</svg>
		<span>Menú</span>
	</button>
</div>

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

	/* elementos sólo-móvil ocultos en escritorio */
	.topbar, .mobile-bar { display: none; }

	main { min-height: 70vh; }

	/* --- Footer profesional --- */
	.site-footer { border-top: 1px solid var(--line); margin-top: 4rem; padding: 3rem 0 1.5rem; background: var(--surface); }
	.footer-grid {
		display: grid; gap: 2rem;
		grid-template-columns: 1.6fr 1fr 1fr 1.2fr;
		padding-bottom: 2rem; border-bottom: 1px solid var(--line);
	}
	.foot-logo { display: flex; align-items: center; gap: 0.5rem; font-family: var(--serif); font-size: 1.3rem; font-weight: 600; margin-bottom: 0.6rem; }
	.foot-brand p { max-width: 34ch; font-size: 0.95rem; margin: 0; }
	.foot-col { display: flex; flex-direction: column; gap: 0.5rem; }
	.foot-col h4 { font-family: var(--sans); font-size: 0.78rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted); margin: 0 0 0.4rem; }
	.foot-col a, .foot-col span { font-size: 0.95rem; color: var(--text); }
	.foot-col a { transition: color 0.15s; }
	.foot-col a:hover { color: var(--accent); }
	.foot-bottom { display: flex; justify-content: space-between; gap: 1rem; flex-wrap: wrap; padding-top: 1.5rem; font-size: 0.88rem; color: var(--muted); }

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
	.menu-foot { text-align: center; padding: 1.5rem; font-size: 0.9rem; }

	@media (prefers-reduced-motion: reduce) {
		.menu-overlay, .menu-nav a { transition: opacity 0.15s ease, visibility 0.15s; transform: none !important; }
	}

	/* ===================== MÓVIL: marco ===================== */
	@media (max-width: 820px) {
		.brand, .desk-nav, .theme-desktop { display: none; }
		.header-inner { height: 56px; }
		.topbar {
			display: flex; align-items: center; gap: 0.55rem; width: 100%;
			background: none; border: 0; cursor: pointer; padding: 0; color: var(--text);
			font-family: var(--serif); font-size: 1.2rem; font-weight: 600;
		}
		.topbar-title { display: inline-flex; align-items: baseline; }
		.sep { color: var(--muted); font-weight: 400; }

		/* marco: bordes laterales del contenido + hueco para la barra inferior */
		main {
			border-left: 1px solid var(--line); border-right: 1px solid var(--line);
			min-height: calc(100vh - 56px - 60px);
		}
		.site-footer { margin-top: 2.5rem; padding-bottom: calc(1.5rem + 60px); }

		.mobile-bar {
			position: fixed; bottom: 0; left: 0; right: 0; z-index: 30; height: 60px;
			display: flex; align-items: stretch; justify-content: space-between;
			background: color-mix(in srgb, var(--bg) 92%, transparent);
			backdrop-filter: blur(10px); border-top: 1px solid var(--line);
		}
		.bar-btn {
			flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.15rem;
			background: none; border: 0; cursor: pointer; color: var(--muted);
			font: inherit; font-size: 0.72rem; letter-spacing: 0.02em;
		}
		.bar-btn:first-child { border-right: 1px solid var(--line); }
		.bar-btn:hover { color: var(--text); }
		.bar-ico { font-size: 1.15rem; line-height: 1; }
	}

	/* Footer responsive */
	@media (max-width: 720px) {
		.footer-grid { grid-template-columns: 1fr 1fr; gap: 1.6rem 1.2rem; }
		.foot-brand { grid-column: 1 / -1; }
	}
	@media (max-width: 420px) {
		.footer-grid { grid-template-columns: 1fr; }
	}
</style>
