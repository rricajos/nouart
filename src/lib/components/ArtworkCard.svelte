<script lang="ts">
	import type { ArtworkWithArtist } from '$lib/server/queries';
	let { artwork }: { artwork: ArtworkWithArtist } = $props();
</script>

<a class="card" href="/obra/{artwork.slug}">
	<div class="card-thumb">
		{#if artwork.image}
			<img src="/uploads/{artwork.image}" alt={artwork.title} loading="lazy" />
		{/if}
	</div>
	<div class="card-body">
		<h3 class="card-title">{artwork.title}</h3>
		<div class="muted" style="font-size:.9rem">{artwork.artist_name}</div>
		<div class="meta">
			{#if artwork.year}<span class="chip">{artwork.year}</span>{/if}
			<span class="likes" title="Me gusta">♥ {artwork.likes}</span>
		</div>
	</div>
</a>

<style>
	.card { display: block; color: inherit; }
	.meta { display: flex; align-items: center; justify-content: space-between; margin-top: 0.6rem; }
	.likes { color: var(--accent); font-size: 0.9rem; font-weight: 600; }
</style>
