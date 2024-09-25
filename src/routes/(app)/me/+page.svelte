<script lang="ts">
	import { couponStore } from '$lib/store/coupon_store';
	import { fetchMe } from '$lib/store/me_store';
	import { userStore } from '$lib/store/user_store';
	import { Avatar } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';
	import { chainId, connected, disconnectWagmi, signerAddress } from 'svelte-wagmi';
	import { getModalStore } from '@skeletonlabs/skeleton';
	import { signOut } from 'firebase/auth';
	import { auth } from '$lib/firebase';
	import SignIn from '$lib/form/auth_form.svelte';
	import { walletLinked } from '$lib/store/wallet_store';
	import ProfileForm from '$lib/form/profile_form.svelte';
	import { NETWORKS } from '$lib/store/nft_store';
	import { shortAddress } from '$lib/util/web3';
	import { page } from '$app/stores';
	import NameForm from '$lib/form/name_form.svelte';
	import LinkForm from '$lib/form/link_form.svelte';
	import ConnectForm from '$lib/form/connect_form.svelte';
	import Fa from 'svelte-fa';
	import { faEnvelope, faGlobe, faUser } from '@fortawesome/free-solid-svg-icons';

	onMount(() => {
		couponStore.fetchAll();
		fetchMe();
	});

	const modalStore = getModalStore();

	function onEditNameClick() {
		if (!$userStore) {
			return;
		}
		modalStore.trigger({
			type: 'component',
			component: {
				ref: ProfileForm
			}
		});
	}

	async function onDisconnectClick() {
		return disconnectWagmi();
	}

	async function onSignOutClick() {
		return signOut(auth);
	}

	$: signView = ($page.url.searchParams.get('mode') || 'sign_in') as 'sign_up' | 'sign_in';
</script>

<section class="max-w-screen-xl pt-28 mx-auto px-4 mt-4">
	<div
		class="w-screen mix-blend-luminosity bg-[url(/assets/polka.png)] absolute top-2 left-0 h-4/5 max-h-[600px] -z-10"
	></div>
	{#if $userStore}
		<div class="w-full gap-6 mb-4 flex items-center justify-center">
			<h2 class="text-3xl font-raleway mt-8 mb-4 text-white/70">Manage User</h2>
			<div class="flex-grow h-0 border-y rounded-full mt-3 border-white/20"></div>
		</div>
		{#if $userStore.user.displayName}
			{#if $connected}
				{#if $walletLinked}
					<div
						class="flex gap-4 bg-[#14141a] rounded-2xl mb-4 py-8 text-white/80 justify-center items-center text-2xl mx-auto"
					>
						<div class="w-16">
							<Avatar
								src={$userStore?.user.photoURL || undefined}
								initials={$userStore?.user.displayName?.substring(0, 2)}
								width="full"
								background="bg-tertiary-900"
							/>
						</div>
						Your profile is complete!
					</div>
				{:else}
					<LinkForm />
				{/if}
			{:else}
				<ConnectForm />
			{/if}
		{:else}
			<NameForm />
		{/if}
		<ul class="list flex flex-col gap-8 bg-[#14141a] shadow-lg rounded-2xl px-8 py-6 mb-10">
			{#if $userStore.user.displayName}
				<li
					class="border-t pb-0 -mb-2 border-white/0 flex flex-col md:flex-row items-start gap-3 md:items-center justify-between"
				>
					<div class="flex gap-2 items-center justify-center">
						<Fa icon={faUser} />
						<span class="flex-auto">{$userStore.user.displayName || ''}</span>
					</div>
					{#if $userStore.user.displayName}
						<button
							on:click={onEditNameClick}
							class="px-4 py-2 rounded-xl flex items-center justify-center bg-neutral-700/75 hover:bg-neutral-700 text-white font-medium"
							>Change nickname</button
						>
					{/if}
				</li>
			{/if}
			<li
				class="border-t pb-0 !mb-3 md:!-mb-3 border-white/10 pt-5 !flex flex-col md:flex-row items-start gap-3 md:!items-center !justify-between !rounded-none"
			>
				<div class="flex gap-2 items-center justify-center">
					<Fa icon={faEnvelope} />
					<span class="flex-auto">{$userStore.user.email || ''}</span>
				</div>
				<button
					class="  px-4 py-2 rounded-xl flex items-center justify-center bg-red-400/30 hover:bg-red-400/40 text-white font-medium"
					on:click={onSignOutClick}
				>
					Logout from device
				</button>
			</li>
			{#if $connected}
				<li
					class="border-t pb-2 border-white/10 pt-5 !flex flex-col md:flex-row gap-3 !items-center !justify-between !rounded-none"
				>
					<div class="flex gap-2 items-center justify-center">
						<Fa icon={faGlobe} />
						<div class="flex-auto flex flex-col">
							<span>{NETWORKS[$chainId || 1].name} ({$chainId})</span>
							<span class="text-xs">{shortAddress($signerAddress || '', 24)}</span>
						</div>
					</div>
					<button
						class="px-4 py-2 rounded-xl flex items-center justify-center bg-red-400/30 hover:bg-red-400/40 text-white font-medium"
						on:click={onDisconnectClick}>Disconnect Wallet</button
					>
				</li>
			{/if}
		</ul>
	{:else}
		<SignIn view={signView} />
	{/if}
</section>
