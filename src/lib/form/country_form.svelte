<script lang="ts">
	import type { DetailedValue, CountryCode, E164Number } from 'svelte-tel-input/types';
	import { auth } from '$lib/firebase';
	import { getModalStore, getToastStore } from '@skeletonlabs/skeleton';
	import { PhoneAuthProvider, RecaptchaVerifier } from 'firebase/auth';
	import { onMount } from 'svelte';
	import OtpForm from './otp_form.svelte';
	import { FirebaseError } from 'firebase/app';
	import PhoneInput from '$lib/ui/phone_input.svelte';

	export let parent = null;

	const modalStore = getModalStore();
	const toastStore = getToastStore();

	// Validity
	let phoneValid = true;
	let phoneCountry: CountryCode | null = 'GB';
	let detailedValue: DetailedValue | null;
	let phoneNumber: E164Number | null = '';

	let applicationVerifier: RecaptchaVerifier;
	let provider: PhoneAuthProvider;

	onMount(() => {
		applicationVerifier = new RecaptchaVerifier(auth, 'recaptcha-container');
		provider = new PhoneAuthProvider(auth);
	});

	async function onSubmit(event: { currentTarget: EventTarget & HTMLFormElement }) {
		const user = auth.currentUser;
		if (!user) {
			return;
		}
		if (!phoneNumber) {
			toastStore.trigger({
				message: 'Please enter your phone number',
				background: 'variant-filled-error'
			});
			return;
		}
		if (!phoneValid) {
			toastStore.trigger({
				message: "The phone number you've entered is invalid",
				background: 'variant-filled-error'
			});
			return;
		}
		try {
			// 'recaptcha-container' is the ID of an element in the DOM.
			const verificationId = await provider.verifyPhoneNumber(phoneNumber, applicationVerifier);
			modalStore.update((modals) => [
				{
					type: 'component',
					component: {
						ref: OtpForm,
						props: {
							verificationId
						}
					}
				},
				...modals
			]);
		} catch (err) {
			if (err instanceof FirebaseError) {
				switch (err.code) {
					case 'auth/too-many-requests':
						toastStore.trigger({
							message: 'Too many requests!',
							background: 'variant-filled-error'
						});
						return;
				}
			}
		}
	}
</script>

<div class="w-full h-full card bg-primary rounded-3xl py-10 px-8 sm:w-2/3 lg:w-1/2">
	<form on:submit|preventDefault={onSubmit} class="flex flex-col items-center w-full h-full">
		<header class="text-2xl mb-6"><strong>Phone number</strong></header>
		<main class="mb-10">
			<PhoneInput
				bind:selectedCountry={phoneCountry}
				bind:value={phoneNumber}
				bind:valid={phoneValid}
				bind:detailedValue
			/>
			<div id="recaptcha-container" />
		</main>
		<footer>
			<button class="btn variant-filled-secondary bg-secondary" type="submit">Submit</button>
		</footer>
	</form>
</div>

<style>
	.wrapper :global(.basic-tel-input) {
		height: 32px;
		padding-left: 12px;
		padding-right: 12px;
		border-radius: 6px;
		border: 1px solid;
		outline: none;
	}

	.wrapper :global(.country-select) {
		height: 36px;
		padding-left: 12px;
		padding-right: 12px;
		border-radius: 6px;
		border: 1px solid;
		outline: none;
	}

	.wrapper :global(.invalid) {
		border-color: red;
	}
</style>
