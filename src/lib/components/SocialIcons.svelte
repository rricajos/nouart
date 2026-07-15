<script lang="ts">
	import { social } from '$lib/content';

	interface Props {
		/** true = footer (tonos claros sobre el panel oscuro). */
		onDark?: boolean;
	}
	let { onDark = false }: Props = $props();

	const anyActive = $derived(social.some((s) => s.url));
</script>

<div class="social" class:on-dark={onDark}>
	{#each social as s (s.id)}
		{@const soon = !s.url}
		<svelte:element
			this={soon ? 'span' : 'a'}
			class="s-ico"
			class:soon
			href={s.url || undefined}
			target={soon ? undefined : '_blank'}
			rel={soon ? undefined : 'noopener'}
			aria-label={soon ? `${s.label} — próximamente` : s.label}
			title={soon ? `${s.label} · próximamente` : s.label}
			aria-disabled={soon ? 'true' : undefined}
		>
			<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
				{#if s.id === 'instagram'}
					<rect x="3" y="3" width="18" height="18" rx="5" />
					<circle cx="12" cy="12" r="4.2" />
					<circle cx="17.3" cy="6.7" r="1.1" fill="currentColor" stroke="none" />
				{:else if s.id === 'facebook'}
					<path d="M14.2 21.5V13h2.6l.5-3.4h-3.1V7.5c0-1 .3-1.6 1.7-1.6h1.6V2.9c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.4-4 4.1v2.7H8.3V13h2.8v8.5z" />
				{:else if s.id === 'whatsapp'}
					<path d="M20.6 11.6a8.4 8.4 0 0 1-12.5 7.3L3.5 20.5l1.6-4.5A8.4 8.4 0 1 1 20.6 11.6z" />
					<path d="M9 8.6c.15-.35.3-.35.5-.36h.42c.14 0 .33 0 .5.4l.66 1.6c.08.16.03.35-.08.45l-.34.4c-.1.13-.2.27-.07.47.42.84 1.15 1.5 2 1.94.17.09.32.03.43-.09l.4-.5c.14-.17.27-.15.44-.09l1.5.74c.17.08.27.13.3.3.03.4-.14.9-.4 1.14-.26.24-.75.4-1.18.4-2.2-.17-4.8-2.7-5.15-5.05-.02-.5.08-1 .34-1.33z" />
				{:else}
					<rect x="2.5" y="5.5" width="19" height="13" rx="4" />
					<path d="M10.4 9.4l5.2 2.6-5.2 2.6z" />
				{/if}
			</svg>
		</svelte:element>
	{/each}

	{#if !anyActive}
		<span class="soon-lbl">Próximamente</span>
	{/if}
</div>

<style>
	.social { display: flex; align-items: center; flex-wrap: wrap; gap: 0.5rem; }
	.s-ico {
		display: inline-flex; align-items: center; justify-content: center;
		width: 36px; height: 36px; border-radius: 999px;
		border: 1px solid var(--line); color: var(--muted); background: var(--surface);
		transition: color 0.15s, border-color 0.15s, background 0.15s, transform 0.15s;
	}
	a.s-ico:hover { color: #fff; background: var(--accent); border-color: var(--accent); transform: translateY(-2px); }
	/* Sin cuenta todavía: se ve que existe pero no invita a pulsar. */
	.s-ico.soon { opacity: 0.45; cursor: default; }
	.soon-lbl { font-size: 0.78rem; letter-spacing: 0.06em; text-transform: uppercase; color: var(--muted); margin-left: 0.2rem; }

	/* Variante para el footer (panel oscuro). */
	.on-dark .s-ico { border-color: var(--foot-line); color: var(--foot-muted); background: transparent; }
	.on-dark a.s-ico:hover { color: #fff; background: var(--accent); border-color: var(--accent); }
	.on-dark .soon-lbl { color: var(--foot-muted); }
</style>
