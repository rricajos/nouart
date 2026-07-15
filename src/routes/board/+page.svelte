<script lang="ts">
	import { board, contact, site } from '$lib/content';
</script>

<svelte:head>
	<title>Junta Directiva · Nou Art</title>
	<meta name="description" content="Las personas que forman la Junta Directiva de Nou Art." />
</svelte:head>

<div class="wrap page">
	<p class="eyebrow">Quiénes somos</p>
	<h1>Junta Directiva</h1>
	<p class="lead muted">
		Las personas que asumen la representación y la gestión de {site.name}. La junta se elige en
		asamblea entre las personas socias.
	</p>

	{#if board.length}
		<div class="grid">
			{#each board as m (m.role + m.name)}
				<article class="member">
					<span class="avatar">
						{#if m.photo}<img src="/uploads/{m.photo}" alt={m.name} />{/if}
					</span>
					<p class="role">{m.role}</p>
					<h2>{m.name}</h2>
					{#if m.bio}<p class="muted bio">{m.bio}</p>{/if}
				</article>
			{/each}
		</div>
	{:else}
		<div class="empty">
			<h2>Estamos actualizando esta información</h2>
			<p class="muted">
				Publicaremos aquí la composición de la Junta Directiva próximamente. Si necesitas contactar
				con la asociación, escríbenos a <a href="mailto:{contact.email}">{contact.email}</a>.
			</p>
			<a href="/contact" class="btn">Contactar</a>
		</div>
	{/if}

	<p class="muted foot-note">
		¿Quieres conocer mejor la asociación? Lee <a href="/about">quiénes somos</a> o
		<a href="/join">hazte socio</a>.
	</p>
</div>

<style>
	.page { padding: 2.5rem 0 4rem; max-width: 900px; }
	h1 { margin-bottom: 0.5rem; }
	.lead { font-size: 1.15rem; max-width: 60ch; margin-bottom: 2.5rem; }
	.grid { display: grid; gap: 1.4rem; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); }
	.member { background: var(--surface); border: 1px solid var(--line); border-radius: var(--radius); box-shadow: var(--shadow); padding: 1.4rem; text-align: center; }
	.avatar { display: block; width: 92px; height: 92px; margin: 0 auto 0.9rem; border-radius: 999px; overflow: hidden; background: var(--surface-2); border: 1px solid var(--line); }
	.avatar img { width: 100%; height: 100%; object-fit: cover; }
	.role { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--accent); font-weight: 600; margin: 0 0 0.2rem; }
	.member h2 { font-size: 1.15rem; margin: 0 0 0.4rem; }
	.bio { font-size: 0.9rem; line-height: 1.5; margin: 0; }
	.empty { background: var(--surface); border: 1px solid var(--line); border-left: 3px solid var(--accent); border-radius: var(--radius); padding: 1.6rem; }
	.empty h2 { font-size: 1.2rem; margin-bottom: 0.4rem; }
	.empty a { color: var(--accent); text-decoration: underline; }
	.empty .btn { margin-top: 1rem; text-decoration: none; color: var(--text); }
	.foot-note { margin-top: 2.5rem; font-size: 0.95rem; }
	.foot-note a { color: var(--accent); text-decoration: underline; }
</style>
