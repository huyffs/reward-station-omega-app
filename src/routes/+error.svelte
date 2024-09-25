<script lang="ts">
	import { page } from '$app/stores';
	import '../app.postcss';

	const emojis: Record<number, string> = {
		404: '🤷‍♀️',
		401: '🔐',
		403: '👮🏽',
		420: '🫠',
		500: '💥'
	};
</script>

<div class="flex justify-center items-center h-full text-center">
	<div class="items-center flex flex-col">
		<div class="text-9xl">
			<span>{emojis[$page.status ?? 500]}</span>
			<span>{$page.status}</span>
		</div>
		{#if $page.error}
			<pre class="code">
				{JSON.stringify($page.error)}
			</pre>
		{/if}
		<a class="btn mt-8 p-4 hover:variant-soft-primary block w-32" href="/">
			<div class="text-4xl">🏡</div>
			<div>Home</div>
		</a>
	</div>
</div>
