<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { page } from '$app/state';
	let { children } = $props();

	let theme = $state<'light' | 'dark' | null>(null);
	let menuOpen = $state(false);

	$effect(() => {
		const saved = localStorage.getItem('nouart-theme') as 'light' | 'dark' | null;
		theme = saved;
		if (saved) document.documentElement.dataset.theme = saved;
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
</script>

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

<header class="site-header">
	<div class="wrap header-inner">
		<a href="/" class="brand">
			<img class="brand-mark" src={favicon} alt="" width="30" height="30" />
			<span class="brand-name">Nou&nbsp;Art</span>
		</a>
		<nav class:open={menuOpen}>
			{#each nav as item (item.href)}
				<a
					href={item.href}
					class="navlink"
					class:active={item.href === '/' ? path === '/' : path.startsWith(item.href)}
					onclick={() => (menuOpen = false)}
				>{item.label}</a>
			{/each}
		</nav>
		<div class="controls">
			<button class="icon-btn" onclick={toggleTheme} aria-label="Cambiar tema" title="Cambiar tema">
				{theme === 'dark' ? '☀' : '☾'}
			</button>
			<button
				class="icon-btn menu-btn"
				onclick={() => (menuOpen = !menuOpen)}
				aria-label="Menú"
				aria-expanded={menuOpen}
			>
				<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
					{#if menuOpen}<path d="M6 6l12 12M18 6L6 18" />{:else}<path d="M4 7h16M4 12h16M4 17h16" />{/if}
				</svg>
			</button>
		</div>
	</div>
</header>

<main>
	{@render children()}
</main>

<footer class="site-footer">
	<div class="wrap footer-inner">
		<div>
			<strong>Nou Art</strong> — Asociación de artistas de Nou Barris
			<div class="muted" style="font-size:.9rem">Arte del barrio, en abierto.</div>
		</div>
		<div class="footer-links">
			<a href="/galeria">Galería</a>
			<a href="/artistas">Artistas</a>
			<a href="/sobre">Sobre nosotros</a>
			<a href="/contacto">Contacto</a>
			<a href="/admin" class="muted">Acceso gestión</a>
		</div>
	</div>
</footer>

<style>
	.site-header {
		position: sticky; top: 0; z-index: 20;
		background: color-mix(in srgb, var(--bg) 88%, transparent);
		backdrop-filter: blur(10px);
		border-bottom: 1px solid var(--line);
	}
	.header-inner { display: flex; align-items: center; gap: 1rem; height: 66px; }
	.brand { display: flex; align-items: center; gap: 0.55rem; font-family: var(--serif); font-size: 1.35rem; font-weight: 600; }
	.brand-mark { display: block; width: 30px; height: 30px; border-radius: 8px; }
	nav { display: flex; gap: 0.35rem; margin-left: auto; }
	.navlink {
		padding: 0.4rem 0.8rem; border-radius: 999px; font-size: 0.95rem; color: var(--muted);
		transition: color 0.15s, background 0.15s; white-space: nowrap;
	}
	.navlink:hover { color: var(--text); background: var(--surface-2); }
	.navlink.active { color: var(--text); background: var(--accent-soft); }
	.controls { display: flex; align-items: center; gap: 0.5rem; }
	.icon-btn {
		width: 40px; height: 40px; border-radius: 999px; border: 1px solid var(--line);
		background: var(--surface); color: var(--text); cursor: pointer; font-size: 1.1rem; line-height: 1;
		display: inline-flex; align-items: center; justify-content: center;
	}
	.icon-btn:hover { border-color: var(--accent); }
	.menu-btn { display: none; }
	main { min-height: 70vh; }
	.site-footer { border-top: 1px solid var(--line); margin-top: 4rem; padding: 2.5rem 0; background: var(--surface); }
	.footer-inner { display: flex; flex-wrap: wrap; gap: 1.5rem; justify-content: space-between; align-items: flex-start; }
	.footer-links { display: flex; flex-wrap: wrap; gap: 1.1rem; font-size: 0.95rem; }
	.footer-links a:hover { color: var(--accent); }
	@media (max-width: 820px) {
		.menu-btn { display: inline-flex; }
		nav {
			position: absolute; top: 100%; left: 0; right: 0; margin: 0;
			flex-direction: column; gap: 0.15rem; align-items: stretch;
			background: var(--surface); border-bottom: 1px solid var(--line);
			padding: 0.6rem 1.25rem 1rem; box-shadow: var(--shadow); display: none;
		}
		nav.open { display: flex; }
		.navlink { padding: 0.75rem 0.8rem; font-size: 1rem; border-radius: 10px; }
	}
</style>
