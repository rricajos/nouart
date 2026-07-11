<script lang="ts">
	import { enhance } from '$app/forms';
	let { data } = $props();
	const submit = () => ({ update }: { update: () => Promise<void> }) => update();
</script>

<svelte:head><title>Comentarios · Gestión</title></svelte:head>

<h1>Comentarios</h1>

<section>
	<h2>Por revisar {#if data.pending.length}<span class="count">{data.pending.length}</span>{/if}</h2>
	{#if data.pending.length}
		<ul class="list">
			{#each data.pending as c (c.id)}
				<li class="pending">
					<div class="c-body">
						<div class="c-head">
							<strong>{c.author}</strong>
							<span class="muted">· sobre <a href="/obra/{c.artwork_slug}" target="_blank">{c.artwork_title}</a></span>
							<span class="muted date">{c.created_at.slice(0, 16).replace('T', ' ')}</span>
						</div>
						<p>{c.body}</p>
					</div>
					<div class="c-actions">
						<form method="POST" action="?/approve" use:enhance={submit}>
							<input type="hidden" name="id" value={c.id} />
							<button class="mini ok">Aprobar</button>
						</form>
						<form method="POST" action="?/delete" use:enhance={submit}>
							<input type="hidden" name="id" value={c.id} />
							<button class="mini danger">Borrar</button>
						</form>
					</div>
				</li>
			{/each}
		</ul>
	{:else}
		<p class="muted">No hay comentarios pendientes. 🎉</p>
	{/if}
</section>

<section>
	<h2>Publicados</h2>
	{#if data.approved.length}
		<ul class="list">
			{#each data.approved as c (c.id)}
				<li>
					<div class="c-body">
						<div class="c-head">
							<strong>{c.author}</strong>
							<span class="muted">· {c.artwork_title}</span>
							<span class="muted date">{c.created_at.slice(0, 10)}</span>
						</div>
						<p>{c.body}</p>
					</div>
					<div class="c-actions">
						<form method="POST" action="?/unapprove" use:enhance={submit}>
							<input type="hidden" name="id" value={c.id} />
							<button class="mini">Ocultar</button>
						</form>
						<form method="POST" action="?/delete" use:enhance={submit}>
							<input type="hidden" name="id" value={c.id} />
							<button class="mini danger">Borrar</button>
						</form>
					</div>
				</li>
			{/each}
		</ul>
	{:else}
		<p class="muted">Todavía no hay comentarios publicados.</p>
	{/if}
</section>

<style>
	h2 { margin-top: 2rem; display: flex; align-items: center; gap: 0.5rem; }
	.count { background: var(--accent); color: #fff; font-size: 0.8rem; padding: 0.1rem 0.5rem; border-radius: 999px; }
	.list { list-style: none; padding: 0; margin: 1rem 0 0; display: flex; flex-direction: column; gap: 0.8rem; }
	.list li { display: flex; gap: 1rem; align-items: flex-start; justify-content: space-between; border: 1px solid var(--line); border-radius: var(--radius); padding: 0.9rem 1.1rem; background: var(--surface); }
	.list li.pending { border-color: var(--accent); background: var(--accent-soft); }
	.c-head { display: flex; flex-wrap: wrap; align-items: baseline; gap: 0.4rem; margin-bottom: 0.25rem; }
	.c-head a { color: var(--accent); }
	.date { font-size: 0.8rem; margin-left: auto; }
	.c-body p { margin: 0; }
	.c-actions { display: flex; gap: 0.4rem; flex: none; }
	.mini { font-size: 0.85rem; padding: 0.35rem 0.7rem; border-radius: 6px; border: 1px solid var(--line); background: var(--surface); color: var(--text); cursor: pointer; font-family: inherit; }
	.mini:hover { border-color: var(--accent); }
	.ok:hover { border-color: #2e7d32; color: #2e7d32; }
	.danger:hover { border-color: #c0392b; color: #c0392b; }
	form { margin: 0; }
</style>
