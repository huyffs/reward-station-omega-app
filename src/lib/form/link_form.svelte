<script lang="ts">
	import { getToastStore } from '@skeletonlabs/skeleton';
	import { linkWallet } from '$lib/store/wallet_store';

	const toastStore = getToastStore();

	async function onLinkClick() {
		return linkWallet()
			.then(() => {
				toastStore.trigger({
					message: 'Linked successfully!',
					background: 'variant-filled-success'
				});
			})
			.catch((err) => {
				toastStore.trigger({
					message: err,
					background: 'variant-filled-error'
				});
			});
	}
</script>

<div
	class="px-6 pr-8 py-6 mb-5 shadow-lg bg-[#14141a] rounded-2xl flex items-center flex-row justify-between"
>
	<svg
		class="h-16 opacity-60 mr-6 aspect-square"
		viewBox="0 0 24 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g
			id="SVGRepo_tracerCarrier"
			stroke-linecap="round"
			stroke-linejoin="round"
		></g><g id="SVGRepo_iconCarrier">
			<path d="M12 17V11" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round"></path>
			<circle cx="1" cy="1" r="1" transform="matrix(1 0 0 -1 11 9)" fill="#ffffff"></circle>
			<path
				d="M7 3.33782C8.47087 2.48697 10.1786 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 10.1786 2.48697 8.47087 3.33782 7"
				stroke="#ffffff"
				stroke-width="1.5"
				stroke-linecap="round"
			></path>
		</g></svg
	>

	<div class="flex-grow flex flex-col gap-1">
		<h2 class="text-2xl font-bold flex-col">Link your wallet!</h2>
		<p class="text-white/60">Prove that you own the wallet by signing a message!</p>
	</div>
	<button
		class="flex gap-2 duration-300 cursor-pointer outline outline-transparent hover:outline-white/20 outline-offset-2 items-center justify-center h-max px-6 py-2 bg-gradient-to-r from-[#515eab] to-[#724786] rounded-full text-white text-lg font-medium"
		on:click={onLinkClick}>Link Wallet</button
	>
</div>
