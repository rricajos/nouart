<script lang="ts">
	import { enhance } from '$app/forms';
	let { data } = $props();
	const roleLabel = (r: string) => (r === 'artist' ? 'Artista' : 'Miembro');
</script>

<h1>Usuarios <span class="muted count">({data.users.length})</span></h1>

{#if data.users.length}
	<table>
		<thead>
			<tr><th>Nombre</th><th>Email</th><th>Rol</th><th>Estado</th><th></th></tr>
		</thead>
		<tbody>
			{#each data.users as u (u.id)}
				<tr>
					<td>
						<strong>{u.name}</strong>
						{#if u.artist_slug}<a href="/artist/{u.artist_slug}" target="_blank" class="mini">perfil ↗</a>{/if}
					</td>
					<td class="muted">{u.email}</td>
					<td><span class="chip" class:artist={u.role === 'artist'}>{roleLabel(u.role)}</span></td>
					<td>
						{#if u.role === 'artist' && !u.approved}
							<span class="chip pending">Pendiente</span>
						{:else if u.role === 'artist'}
							<span class="chip ok">Aprobado</span>
						{:else}
							<span class="muted">—</span>
						{/if}
					</td>
					<td class="actions">
						{#if u.role === 'artist' && !u.approved}
							<form method="POST" action="?/approve" use:enhance>
								<input type="hidden" name="id" value={u.id} />
								<button class="btn-mini approve">Aprobar</button>
							</form>
						{:else if u.role === 'artist'}
							<form method="POST" action="?/revoke" use:enhance>
								<input type="hidden" name="id" value={u.id} />
								<button class="btn-mini">Revocar</button>
							</form>
						{/if}
						<form method="POST" action="?/remove" use:enhance onsubmit={(e) => { if (!confirm('¿Eliminar este usuario?')) e.preventDefault(); }}>
							<input type="hidden" name="id" value={u.id} />
							<button class="btn-mini danger">Eliminar</button>
						</form>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
{:else}
	<p class="muted">Todavía no hay usuarios registrados.</p>
{/if}

<style>
	h1 { margin-bottom: 1.4rem; }
	.count { font-size: 1rem; font-weight: 400; }
	table { width: 100%; border-collapse: collapse; font-size: 0.94rem; }
	th { text-align: left; font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.06em; color: var(--muted); padding: 0 0.6rem 0.6rem; }
	td { padding: 0.7rem 0.6rem; border-top: 1px solid var(--line); vertical-align: middle; }
	.mini { font-size: 0.8rem; color: var(--accent); margin-left: 0.5rem; }
	.chip { display: inline-block; font-size: 0.78rem; padding: 0.12rem 0.55rem; border-radius: 999px; background: var(--surface-2); border: 1px solid var(--line); color: var(--muted); }
	.chip.artist { color: var(--accent); border-color: var(--accent-soft); }
	.chip.pending { background: #fdf1e7; color: #a2560f; border-color: #f2d5b8; }
	.chip.ok { background: #e8f3ea; color: #1f7a3a; border-color: #cfe6d4; }
	.actions { display: flex; gap: 0.4rem; justify-content: flex-end; }
	.actions form { margin: 0; }
	.btn-mini { font: inherit; font-size: 0.82rem; padding: 0.3rem 0.7rem; border-radius: 7px; border: 1px solid var(--line); background: var(--surface); color: var(--text); cursor: pointer; white-space: nowrap; }
	.btn-mini:hover { border-color: var(--accent); }
	.btn-mini.approve { background: var(--accent); color: #fff; border-color: var(--accent); }
	.btn-mini.danger:hover { border-color: #c0392b; color: #c0392b; }
	@media (prefers-color-scheme: dark) {
		.chip.pending { background: #3a2a15; color: #f0b674; border-color: #5a4327; }
		.chip.ok { background: #16301f; color: #7fd39a; border-color: #2c4f37; }
	}
</style>
