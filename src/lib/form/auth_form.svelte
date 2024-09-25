<script lang="ts">
	import {
		signInWithEmailAndPassword,
		type AuthError,
		createUserWithEmailAndPassword,
		sendPasswordResetEmail
	} from 'firebase/auth';
	import { getToastStore } from '@skeletonlabs/skeleton';
	import { setUser } from '$lib/store/user_store';
	import { auth } from '$lib/firebase';
	import { refreshIdToken } from '$lib/util/fetch';

	type Field = {
		error?: string;
		value: string;
	};

	type SignInForm = {
		email: Field;
		password: Field;
	};

	let signInForm: SignInForm = {
		email: { value: '' },
		password: { value: '' }
	};

	const toastStore = getToastStore();

	async function onSignInSubmit(event: SubmitEvent) {
		if (signInForm.password.value.length < 8) {
			signInForm.password.error = 'Password is too short';
			toastStore.trigger({
				message: 'Password is too short',
				background: 'variant-filled-error'
			});
			return;
		}

		try {
			const creds = await signInWithEmailAndPassword(
				auth,
				signInForm.email.value,
				signInForm.password.value
			);
			await setUser(creds.user);
			toastStore.trigger({
				message: 'Sign in successful!',
				background: 'variant-filled-success'
			});
			await refreshIdToken();
		} catch (err: any) {
			const error: AuthError = err;
			let message: string;
			switch (error.code) {
				case 'auth/wrong-password':
					message = 'Your email/password is incorrect';
					break;
				default:
					message = `Error: ${err}`;
			}

			toastStore.trigger({
				message,
				background: 'variant-filled-error',
				hoverable: true
			});
		}
	}

	type SignUpForm = {
		email: Field;
		password: Field;
		confirmPassword: Field;
	};

	let signUpForm: SignUpForm = {
		email: { value: '' },
		password: { value: '' },
		confirmPassword: { value: '' }
	};

	async function onSignUpSubmit(event: SubmitEvent) {
		if (signUpForm.password.value.length < 8) {
			signUpForm.password.error = 'Password is too short';
			toastStore.trigger({
				message: 'Password is too short',
				background: 'variant-filled-error'
			});
			return;
		}
		if (signUpForm.password.value != signUpForm.confirmPassword.value) {
			signUpForm.password.error = 'Password is too short';
			toastStore.trigger({
				message: 'The password confirmation does not match',
				background: 'variant-filled-error'
			});
			return;
		}
		try {
			await createUserWithEmailAndPassword(auth, signUpForm.email.value, signUpForm.password.value);
			toastStore.trigger({
				message: 'Sign Up successful!',
				background: 'variant-filled-success'
			});
		} catch (err: any) {
			const error: AuthError = err;
			let message: string;
			switch (error.code) {
				case 'auth/email-already-in-use':
					message = 'Your email is already in use, please use another one';
					break;
				default:
					message = `Error: ${err}`;
			}
			toastStore.trigger({
				message,
				background: 'variant-filled-error',
				hoverable: true
			});
		}
	}

	async function onResetPasswordSubmit(event: SubmitEvent) {
		if (signInForm.email.value.length < 5) {
			signInForm.email.error = 'Email address not valid';
			toastStore.trigger({
				message: 'Email address is invalid',
				background: 'variant-filled-error'
			});
			return;
		}

		try {
			await sendPasswordResetEmail(auth, signInForm.email.value);
			toastStore.trigger({
				message: 'Check your email inbox!',
				background: 'variant-filled-success'
			});
		} catch (err: any) {
			const error: AuthError = err;
			let message: string;
			switch (error.code) {
				case 'auth/user-not-found':
					message = 'This email has not been registered with Reward Station';
					break;
				case 'auth/invalid-email':
					message = 'Email address is invalid';
					break;
				default:
					message = `Error: ${err}`;
			}

			toastStore.trigger({
				message,
				background: 'variant-filled-error',
				hoverable: true
			});
		}
	}

	export let view: 'sign_up' | 'sign_in' | 'reset_password' = 'sign_up';
</script>

{#if view === 'sign_in'}
	<div class="flex bg-[#1A1A21] rounded-xl py-12 px-8 flex-col max-w-[420px] mx-auto mt-4">
		<div class="mb-8">
			<h2 class="text-3xl font-bold my-2">Sign in</h2>
			<!-- <p class="text-white/50 ">Sign in with email and password</p> -->
		</div>
		<form on:submit|preventDefault={onSignInSubmit} method="POST" class="flex flex-col gap-4">
			<label class="flex flex-col gap-1">
				<div class="text-white/60 font-light">Email Address</div>
				<input
					name="email"
					type="email"
					bind:value={signInForm.email.value}
					placeholder="Enter your email"
					required
					class="py-2 px-4 bg-transparent border-2 rounded-lg border-white/20 placeholder-white/30"
					class:input-error={signInForm.email.error}
				/>
			</label>
			<label class="flex flex-col gap-1">
				<div class="text-white/60 font-light">Password</div>
				<input
					name="password"
					type="password"
					bind:value={signInForm.password.value}
					placeholder="Enter your Password"
					required
					class="py-2 px-4 bg-transparent border-2 rounded-lg border-white/20 placeholder-white/30"
					class:input-error={signInForm.password.error}
				/>
			</label>
			<button
				class="text-base w-max hover:underline -mt-1 text-white/60 font-light"
				on:click={() => (view = 'reset_password')}>Forgot Password?</button
			>
			<div class="flex justify-between items-center flex-col gap-2 pt-5">
				<button
					class="w-full py-2.5 rounded-xl bg-white/80 text-black/90 font-semibold outline outline-transparent outline-offset-2 hover:outline-white/20"
					>Login Now</button
				>
				<p class="my-2 text-white/60 font-light">
					Haven't signed up yet?
					<button
						class="text-white underline font-normal underline-offset-2 decoration-1"
						on:click={() => (view = 'sign_up')}>Register Now</button
					>
				</p>
			</div>
		</form>
		<div id="recaptcha-container" class="justify-center flex" />
	</div>
{:else if view === 'sign_up'}
	<div class="flex bg-[#1A1A21] rounded-xl py-8 px-8 flex-col max-w-[420px] mx-auto mt-4">
		<div class="mb-8">
			<h2 class="text-3xl font-bold my-2">Create Account</h2>
			<!-- <p class="text-white/50 ">Sign in with email and password</p> -->
		</div>
		<form on:submit|preventDefault={onSignUpSubmit} method="POST" class="flex flex-col gap-4">
			<label class="flex flex-col gap-1">
				<div class="text-white/60 font-light">Email Address</div>
				<input
					name="email"
					type="email"
					bind:value={signUpForm.email.value}
					placeholder="Enter your email"
					required
					class="py-2 px-4 bg-transparent border-2 rounded-lg border-white/20 placeholder-white/30"
					class:input-error={signUpForm.email.error}
				/>
			</label>
			<label class="flex flex-col gap-1">
				<div class="text-white/60 font-light">Password</div>
				<input
					name="password"
					type="password"
					bind:value={signUpForm.password.value}
					placeholder="Enter your Password"
					required
					class="py-2 px-4 bg-transparent border-2 rounded-lg border-white/20 placeholder-white/30"
					class:input-error={signUpForm.password.error}
				/>
			</label>
			<label class="flex flex-col gap-1">
				<div class="text-white/60 font-light">Confirm Password</div>
				<input
					name="confirmPassword"
					type="confirmPassword"
					bind:value={signUpForm.confirmPassword.value}
					placeholder="Confirm your password"
					required
					class="py-2 px-4 bg-transparent border-2 rounded-lg border-white/20 placeholder-white/30"
					class:input-error={signUpForm.confirmPassword.error}
				/>
			</label>
			<div class="flex justify-between items-center flex-col gap-2 pt-5">
				<button
					class="w-full py-2.5 rounded-xl bg-white/80 text-black/90 font-semibold outline outline-transparent outline-offset-2 hover:outline-white/20"
					>Register Now</button
				>
				<p class="my-2 text-white/60 font-light">
					Already signed up?
					<button
						class="text-white underline font-normal underline-offset-2 decoration-1"
						on:click={() => (view = 'sign_in')}>Login Now</button
					>
				</p>
			</div>
		</form>
		<div id="recaptcha-container" class="justify-center flex" />
	</div>
{:else if view === 'reset_password'}
	<div class="flex flex-col max-w-sm mx-auto mt-4">
		<div class="mb-8">
			<h2 class="h2 font-bold my-2">Reset password</h2>
			<p>A link will be sent to your email address</p>
		</div>
		<form on:submit|preventDefault={onResetPasswordSubmit} method="POST" class="flex flex-col">
			<label class="label">
				<span class="block my-2">Email</span>
				<input
					name="email"
					type="email"
					bind:value={signInForm.email.value}
					placeholder="Enter your email"
					required
					class="input p-2"
					class:input-error={signInForm.email.error}
				/>
			</label>
			<div class="flex justify-center items-center py-5">
				<button class="btn variant-filled-primary">Submit</button>
			</div>
			<hr />
			<button class="anchor my-4" on:click={() => (view = 'sign_in')}>Back to sign-in</button>
		</form>
		<div id="recaptcha-container" class="justify-center flex" />
	</div>
{/if}
