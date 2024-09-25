<script lang="ts">
	import { auth } from '$lib/firebase';
	import { getModalStore, getToastStore } from '@skeletonlabs/skeleton';
	import { updateProfile } from 'firebase/auth';

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
</script>

<div class="px-8 py-6 bg-[#14141a] rounded-2xl mb-5">
	<div>
		<h2 class="text-2xl font-semibold my-2">You're Almost there!</h2>
		<p class="text-white/50">
			Choose a Nickname to proceed. This will be used as a display name for your account
		</p>
	</div>
	<div class="flex flex-col max-w-lg mt-4 border-t border-white/10  pt-6">
		<form
			on:submit|preventDefault={onSubmit}
			method="POST"
			class="flex flex-col md:flex-row items-start md:items-center justify-start gap-3"
		>
				<input
					name="name"
					bind:value={name}
					placeholder="Choose a cool nickname!"
					required
					class="px-4 py-2 rounded-xl bg-white/[0.02] focus:outline-none focus:border-white/40 border border-white/20 placeholder-white/40"
				/>
			<button class="w-max text-nowrap px-5 py-2 bg-white/10 rounded-xl text-white/80 border border-white/10">Set Name</button>
		</form>
		<div id="recaptcha-container" class="justify-center flex" />
	</div>
</div>
