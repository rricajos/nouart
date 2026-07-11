<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { page } from '$app/state';
	let { children } = $props();

	let theme = $state<'light' | 'dark' | null>(null);

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
		{ href: '/sobre', label: 'Sobre Nou Art' }
	];
	const path = $derived(page.url.pathname);
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<header class="site-header">
	<div class="wrap header-inner">
		<a href="/" class="brand">
			<span class="brand-mark">◆</span>
			<span class="brand-name">Nou&nbsp;Art</span>
		</a>
		<nav>
			{#each nav as item (item.href)}
				<a
					href={item.href}
					class="navlink"
					class:active={item.href === '/' ? path === '/' : path.startsWith(item.href)}
				>{item.label}</a>
			{/each}
		</nav>
		<button class="theme-btn" onclick={toggleTheme} aria-label="Cambiar tema" title="Cambiar tema">
			{theme === 'dark' ? '☀' : '☾'}
		</button>
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
	.brand { display: flex; align-items: center; gap: 0.5rem; font-family: var(--serif); font-size: 1.35rem; font-weight: 600; }
	.brand-mark { color: var(--accent); }
	nav { display: flex; gap: 0.35rem; margin-left: auto; }
	.navlink {
		padding: 0.4rem 0.8rem; border-radius: 999px; font-size: 0.95rem; color: var(--muted);
		transition: color 0.15s, background 0.15s;
	}
	.navlink:hover { color: var(--text); background: var(--surface-2); }
	.navlink.active { color: var(--text); background: var(--accent-soft); }
	.theme-btn {
		width: 40px; height: 40px; border-radius: 999px; border: 1px solid var(--line);
		background: var(--surface); color: var(--text); cursor: pointer; font-size: 1.1rem; line-height: 1;
	}
	.theme-btn:hover { border-color: var(--accent); }
	main { min-height: 70vh; }
	.site-footer { border-top: 1px solid var(--line); margin-top: 4rem; padding: 2.5rem 0; background: var(--surface); }
	.footer-inner { display: flex; flex-wrap: wrap; gap: 1.5rem; justify-content: space-between; align-items: flex-start; }
	.footer-links { display: flex; flex-wrap: wrap; gap: 1.1rem; font-size: 0.95rem; }
	.footer-links a:hover { color: var(--accent); }
	@media (max-width: 640px) {
		nav { gap: 0; }
		.navlink { padding: 0.4rem 0.55rem; font-size: 0.9rem; }
		.brand-name { display: none; }
	}
</style>
