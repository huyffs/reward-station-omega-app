<script lang="ts">
	import Truncate from './truncate.svelte';

	export let logo: string | undefined = undefined;
	export let href: string;
	export let title: string;
	export let intro: string;
	let clazz: string = '';
	export { clazz as class };
</script>

<a
	class="bg-gradient-to-br hover:scale-[.98] hover:ring-1 ring-white/20 duration-200 hover:from-white/5 hover:to-white/5  from-white/[0.02] to-white/5 border border-white/5 rounded-3xl overflow-hidden h-max lg:h-56 p-1 lg:p-3 flex flex-col lg:flex-row sm:gap-1 md:gap-2 lg:gap-4 {clazz}"
	{href}
>
	<header class="overflow-hidden lg:w-max w-full h-60 lg:h-full rounded-2xl">
		<img src={logo} alt="logo" class="h-full w-full lg:w-max lg:aspect-square object-cover" />
	</header>
	<div class="px-2 py-2 gap-3 flex-1 flex flex-col">
		<h2 class="text-2xl font-raleway">{title}</h2>
		<slot name="footer" />
		<div class="text-base text-white/50 max-h-28 overflow-y-scroll">

			{#if intro}
			<p class="flex-auto overflow-y-auto">
				{intro} Ahoy, mateys! Are ye ready to stake yer claim and carve yer name in the annals of our
				burgeoning web3 frontier? In "Stake yer claim," ye'll be venturing into the uncharted depths
				of the metaverse, acquirin' land plots that hold the potential for bountiful rewards. Invest
				wisely, me hearties, and yer land will yield passive income in the form of $UTC, the official
				currency of Uncharted Territories.
			</p>
			{/if}
			<slot name="body" />
		</div>
	</div>
</a>
