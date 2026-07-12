<script lang="ts">
	import { enhance } from '$app/forms';
	let { data } = $props();
	const submit = () => ({ update }: { update: () => Promise<void> }) => update();
</script>

<svelte:head><title>Mensajes · Gestión</title></svelte:head>

<h1>Mensajes</h1>
<p class="muted intro">Mensajes de contacto que el público envía sobre las obras.</p>

{#if data.messages.length}
	<ul class="list">
		{#each data.messages as m (m.id)}
			<li class:unread={!m.handled}>
				<div class="m-main">
					<div class="m-head">
						<strong>{m.name}</strong>
						<a class="email" href="mailto:{m.email}">{m.email}</a>
						{#if m.artist_name}<span class="chip">→ {m.artist_name}</span>{/if}
						<span class="muted date">{m.created_at.slice(0, 16).replace('T', ' ')}</span>
					</div>
					<p>{m.body}</p>
				</div>
				<div class="m-actions">
					<a class="mini" href="mailto:{m.email}?subject=Re: tu mensaje en Nou Art">Responder</a>
					<form method="POST" action="?/toggle" use:enhance={submit}>
						<input type="hidden" name="id" value={m.id} />
						<button class="mini">{m.handled ? 'Marcar sin leer' : 'Marcar leído'}</button>
					</form>
					<form method="POST" action="?/delete" use:enhance={submit}
						onsubmit={(e) => { if (!confirm('¿Borrar este mensaje?')) e.preventDefault(); }}>
						<input type="hidden" name="id" value={m.id} />
						<button class="mini danger">Borrar</button>
					</form>
				</div>
			</li>
		{/each}
	</ul>
{:else}
	<p class="muted">No hay mensajes todavía.</p>
{/if}

<style>
	.intro { margin-top: -0.5rem; margin-bottom: 1.5rem; }
	.list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.8rem; }
	.list li { display: flex; gap: 1rem; align-items: flex-start; justify-content: space-between; border: 1px solid var(--line); border-radius: var(--radius); padding: 1rem 1.1rem; background: var(--surface); }
	.list li.unread { border-color: var(--accent); background: var(--accent-soft); }
	.m-head { display: flex; flex-wrap: wrap; align-items: baseline; gap: 0.5rem; margin-bottom: 0.3rem; }
	.email { color: var(--accent); font-size: 0.9rem; }
	.date { font-size: 0.8rem; margin-left: auto; }
	.m-main p { margin: 0; white-space: pre-wrap; }
	.m-actions { display: flex; flex-direction: column; gap: 0.4rem; flex: none; }
	.mini { font-size: 0.83rem; padding: 0.35rem 0.7rem; border-radius: 6px; border: 1px solid var(--line); background: var(--surface); color: var(--text); cursor: pointer; font-family: inherit; text-align: center; white-space: nowrap; }
	.mini:hover { border-color: var(--accent); }
	.danger:hover { border-color: #c0392b; color: #c0392b; }
	form { margin: 0; }
	@media (max-width: 640px) { .list li { flex-direction: column; } .m-actions { flex-direction: row; flex-wrap: wrap; } }
</style>
