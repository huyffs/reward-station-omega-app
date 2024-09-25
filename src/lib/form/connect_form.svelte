<script lang="ts">
	import { getModeAutoPrefers, getToastStore } from '@skeletonlabs/skeleton';
	import { loading, web3Modal } from 'svelte-wagmi';

	const toastStore = getToastStore();

	async function onConnectClick() {
		$loading = true;
		$web3Modal.setTheme({
			themeMode: getModeAutoPrefers() ? 'light' : 'dark'
		});
		await $web3Modal.openModal();
		$loading = false;
	}
</script>

<div class=" flex-col py-7 bg-[#14141a] rounded-2xl mb-4 flex items-center justify-center">
	<div class="text-center">
		<h2 class="text-xl md:text-3xl font-semibold my-2">Connect to your web3 wallet!</h2>
		<p class="text-white/60 px-4">Authorize Reward Station to see your wallet address!</p>
	</div>
	<div class="flex flex-col max-w-sm mx-auto mt-8">
		<button class="bg-green-700 px-5 py-1.5 rounded-full text-lg" on:click={onConnectClick}>
			{#if $loading}
				<span class="loader" />Connecting...
			{:else}
				Connect
			{/if}
		</button>
	</div>
</div>
