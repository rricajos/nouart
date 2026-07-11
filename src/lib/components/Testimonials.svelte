<script lang="ts">
	import { testimonials } from '$lib/content';

	function initials(name: string): string {
		return name
			.split(/\s+/)
			.map((w) => w[0])
			.join('')
			.slice(0, 2)
			.toUpperCase();
	}
</script>

<div class="grid">
	{#each testimonials as t (t.name)}
		<figure class="tcard">
			<div class="stars" aria-label={`${t.stars} de 5`}>
				{#each Array(5) as _, i (i)}<span class:on={i < t.stars}>★</span>{/each}
			</div>
			<blockquote>{t.quote}</blockquote>
			<figcaption>
				<span class="avatar">{initials(t.name)}</span>
				<span>
					<strong>{t.name}</strong>
					<span class="role">{t.role}</span>
				</span>
			</figcaption>
		</figure>
	{/each}
</div>

<style>
	.grid { display: grid; gap: 1.4rem; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); }
	.tcard {
		margin: 0; padding: 1.6rem; background: var(--surface); border: 1px solid var(--line);
		border-radius: var(--radius); box-shadow: var(--shadow); display: flex; flex-direction: column;
	}
	.stars { color: var(--accent); letter-spacing: 2px; margin-bottom: 0.8rem; font-size: 1rem; }
	.stars span { color: var(--line); }
	.stars span.on { color: var(--accent); }
	blockquote { margin: 0 0 1.2rem; font-family: var(--serif); font-size: 1.12rem; line-height: 1.45; flex: 1; }
	figcaption { display: flex; align-items: center; gap: 0.7rem; }
	.avatar {
		width: 44px; height: 44px; border-radius: 999px; flex: none; display: grid; place-items: center;
		background: var(--accent-soft); color: var(--accent); font-weight: 700; font-size: 0.9rem;
	}
	.role { display: block; font-size: 0.85rem; color: var(--muted); }
</style>
