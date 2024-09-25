<script lang="ts">
	export let text: string;
	export let length: number;
	export let href: string | undefined = undefined;
	export let more: boolean | string | undefined = undefined;
</script>

<div class="text-white/60">
	{#if text.length < length}
		{text}
	{:else}
		{text.substring(0, length)}
		{#if more}
			{#if href}
				<a {href} class="anchor">more →</a>
			{:else}
				<span class="text-green-600"
					>{#if more === true}
						 ...<span
							class=" underline decoration-1 underline-offset-2 decoration-green-400/30"
							>read more</span
						>{:else}{more}{/if}</span
				>
			{/if}
		{/if}
	{/if}
</div>
