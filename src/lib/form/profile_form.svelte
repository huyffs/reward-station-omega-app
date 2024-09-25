<script lang="ts">
	import { auth } from '$lib/firebase';
	import { getModalStore, getToastStore } from '@skeletonlabs/skeleton';
	import { updateProfile } from 'firebase/auth';

	export let parent = null;
	const modalStore = getModalStore();
	const toastStore = getToastStore();

	let name: string = auth.currentUser?.displayName || '';

	async function onSubmit(event: { currentTarget: EventTarget & HTMLFormElement }) {
		const user = auth.currentUser!;
		if (!user) {
			return;
		}
		if (!name) {
			toastStore.trigger({
				message: 'Please enter your name',
				background: 'variant-filled-error'
			});
			return;
		}
		updateProfile(user, {
			displayName: name
		})
			.then(() => {
				modalStore.close();
				toastStore.trigger({
					message: 'Success!',
					background: 'variant-filled-success'
				});
				auth.currentUser?.getIdToken(true);
			})
			.catch(() => {
				toastStore.trigger({
					message: 'Failed to update your name, please try again lager.',
					background: 'variant-filled-error'
				});
			});
	}

	function onCancelClick() {
		modalStore.close();
	}
</script>

<div
	class="bg-[#14141b] border-white/10 border shadow-xl h-full rounded-3xl py-6 px-8 w-max"
>
	<form on:submit|preventDefault={onSubmit} class="flex gap-8 flex-col items-center w-full h-full">
		<div class="flex flex-col gap-3">
			<header class="text-2xl font-medium">What's your nickname?</header>

			<label class="w-full max-w-80 text-center">
				<input
					bind:value={name}
					name="name"
					placeholder="Type your nickname"
					class="w-full py-1.5 px-3 bg-white/5 border border-white/10 rounded-xl"
				/>
			</label>
		</div>
		<footer class="flex gap-2 w-full">
			<button class="w-full h-max py-2 rounded-xl hover:ring-2 ring-red-700/50 text-red-300 hover:bg-red-500/10 bg-red-300/10" type="button" on:click={onCancelClick}>Cancel</button>
			<button class="w-full h-max py-2 rounded-xl hover:ring-2 text-green-400 ring-green-600 hover:bg-green-900/70 bg-green-900/40" type="submit">Update</button>
		</footer>
	</form>
</div>
