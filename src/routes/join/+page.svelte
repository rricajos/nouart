<script lang="ts">
	import { membership, contact, site } from '$lib/content';
</script>

<svelte:head>
	<title>Hazte socio · Nou Art</title>
	<meta name="description" content="Hazte socio o socia de Nou Art y apoya la cultura de Nou Barris: ventajas, cuotas y cómo asociarte." />
	<meta property="og:title" content="Hazte socio · Nou Art" />
	<meta property="og:description" content="Apoya la cultura de barrio y forma parte de la comunidad de Nou Art." />
</svelte:head>

<div class="wrap page">
	<p class="eyebrow">Únete</p>
	<h1>Hazte socio o socia</h1>
	<p class="lead muted">{membership.lead}</p>

	<section class="block">
		<h2>Ventajas</h2>
		<ul class="benefits">
			{#each membership.benefits as b (b)}
				<li>{b}</li>
			{/each}
		</ul>
	</section>

	<section class="block">
		<h2>Cuotas</h2>
		{#if membership.fees.length}
			<div class="fees">
				{#each membership.fees as f (f.name)}
					<article class="fee">
						<h3>{f.name}</h3>
						<p class="price">{f.price}</p>
						{#if f.note}<p class="muted note">{f.note}</p>{/if}
					</article>
				{/each}
			</div>
		{:else}
			<p class="muted">
				Estamos actualizando la información de cuotas. Escríbenos y te contamos las condiciones
				vigentes sin compromiso.
			</p>
		{/if}
	</section>

	<section class="block">
		<h2>Cómo hacerse socio</h2>
		<ol class="steps">
			{#each membership.steps as s, i (s)}
				<li><span class="num">{i + 1}</span><span>{s}</span></li>
			{/each}
		</ol>
	</section>

	<section class="cta">
		<h2>¿Te animas?</h2>
		<p class="muted">
			Escríbenos y te acompañamos en el alta. Estamos en {contact.location}.
		</p>
		<div class="cta-row">
			<a href="/contact" class="btn btn-primary">Quiero asociarme</a>
			<a href="mailto:{contact.email}" class="btn">{contact.email}</a>
		</div>
	</section>

	<p class="muted faq-link">
		¿Dudas antes de decidir? Mira las <a href="/faq">preguntas frecuentes</a> o conoce
		<a href="/about">quiénes somos</a> en {site.name}.
	</p>
</div>

<style>
	.page { padding: 2.5rem 0 4rem; max-width: 760px; }
	h1 { margin-bottom: 0.5rem; }
	.lead { font-size: 1.2rem; max-width: 60ch; margin-bottom: 2.5rem; }
	.block { margin-bottom: 2.5rem; }
	h2 { font-size: 1.3rem; margin-bottom: 1rem; }
	.benefits { list-style: none; padding: 0; margin: 0; display: grid; gap: 0.6rem; }
	.benefits li { position: relative; padding-left: 1.6rem; line-height: 1.6; }
	.benefits li::before { content: ''; position: absolute; left: 0; top: 0.6em; width: 8px; height: 8px; border-radius: 2px; background: var(--accent); }
	.fees { display: grid; gap: 1rem; grid-template-columns: repeat(auto-fit, minmax(190px, 1fr)); }
	.fee { background: var(--surface); border: 1px solid var(--line); border-radius: var(--radius); box-shadow: var(--shadow); padding: 1.3rem; }
	.fee h3 { font-size: 1.05rem; margin-bottom: 0.3rem; }
	.price { font-family: var(--serif); font-size: 1.8rem; color: var(--accent); margin: 0; }
	.note { font-size: 0.88rem; margin: 0.4rem 0 0; }
	.steps { list-style: none; padding: 0; margin: 0; display: grid; gap: 0.9rem; }
	.steps li { display: flex; align-items: flex-start; gap: 0.8rem; line-height: 1.6; }
	.num { flex: none; width: 26px; height: 26px; border-radius: 999px; background: var(--accent-soft); color: var(--accent); font-weight: 700; font-size: 0.85rem; display: inline-flex; align-items: center; justify-content: center; margin-top: 0.1rem; }
	.cta { background: var(--surface); border: 1px solid var(--line); border-left: 3px solid var(--accent); border-radius: var(--radius); padding: 1.6rem; }
	.cta h2 { margin-bottom: 0.3rem; }
	.cta-row { display: flex; gap: 0.7rem; flex-wrap: wrap; margin-top: 1.1rem; }
	.faq-link { margin-top: 2rem; font-size: 0.95rem; }
	.faq-link a { color: var(--accent); text-decoration: underline; }
</style>
