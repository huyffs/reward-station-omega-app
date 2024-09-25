<script lang="ts">
	import { invalidate } from '$app/navigation';
	import { page } from '$app/stores';
	import { auth } from '$lib/firebase';
	import { getModalStore, getToastStore } from '@skeletonlabs/skeleton';
	import { FirebaseError } from 'firebase/app';
	import { PhoneAuthProvider, updatePhoneNumber, updateProfile } from 'firebase/auth';

	export let parent = null;
	export let verificationId: string;

	const modalStore = getModalStore();
	const toastStore = getToastStore();

	let otp: string;

	async function onSubmit(event: { currentTarget: EventTarget & HTMLFormElement }) {
		if (!auth.currentUser) {
			return;
		}
		if (!otp) {
			toastStore.trigger({
				message: 'Please enter the verification code sent to your mobile phone',
				background: 'variant-filled-error'
			});
			return;
		}
		if (otp.length != 6) {
			toastStore.trigger({
				message: 'The verification code is 6 digits long, please try again.',
				background: 'variant-filled-error'
			});
			return;
		}
		const phoneCredential = PhoneAuthProvider.credential(verificationId, otp);
		updatePhoneNumber(auth.currentUser, phoneCredential)
			.then(() => {
				modalStore.clear();
				toastStore.trigger({
					message: 'Success!',
					background: 'variant-filled-success'
				});
				auth.currentUser?.getIdToken(true);
			})
			.catch((err) => {
				if (err instanceof FirebaseError) {
					switch (err.code) {
						case 'auth/invalid-verification-code':
							toastStore.trigger({
								message: 'The verification code is incorrect',
								background: 'variant-filled-error'
							});
							modalStore.close();
							return;
						case 'auth/account-exists-with-different-credential':
							toastStore.trigger({
								message: 'This phone number is already linked to another account',
								background: 'variant-filled-error'
							});
							modalStore.close();
							return;
					}
				}
				toastStore.trigger({
					message: 'The code entered is incorrect, please try again.' + err,
					background: 'variant-filled-error'
				});
			});
	}
</script>
<div class="w-full h-full card bg-primary rounded-3xl py-10 px-8 sm:w-2/3 lg:w-1/2">
	<form on:submit|preventDefault={onSubmit} class="flex flex-col items-center w-full h-full">
		<header class="text-2xl mb-6"><strong>Verification code</strong></header>
		<main class="mb-10">
			<label class="label text-center">
				<span>Please enter the verification code sent to your mobile phone</span>
				<input bind:value={otp} name="name" placeholder="E.g. 000000" class="input !mt-6 p-2" />
			</label>
		</main>
		<footer>
			<button class="btn variant-filled-secondary bg-secondary" type="submit">Submit</button>
		</footer>
	</form>
</div>
