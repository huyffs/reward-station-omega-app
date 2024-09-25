<script lang="ts">
	import Truncate from './truncate.svelte';

	export let logo: string | undefined = undefined;
	export let href: string;
	export let title: string;
	export let intro: string;
	let clazz: string = '';
	export { clazz as class };
</script>

<div class="w-full pt-12 {clazz}">
	<a {href} class="bg-[#121218] hover:bg-[#141419] outline-transparent outline-offset-2 outline hover:outline-neutral-800 card-hover rounded-[32px] h-full p-6 flex flex-col items-start gap-2">
		<div class="w-full border-b-2 border-white/5 flex justify-between h-max pb-4">
			{#if logo}
				<img src={logo} alt="logo" class="relative z-10 rounded-full ml-2 w-28 h-28 border-neutral-900 border-4 -mt-16" />
			{/if}
			<slot name="body" />
		</div>
		<div class="flex flex-col w-full relative py-2">
			<h3 class="text-2xl font-raleway mb-2 break-words">{title}</h3>
			<p>
				<Truncate text={intro} length={200} more />
			</p>
		</div>
		<slot name="footer" />
	</a>
</div>
