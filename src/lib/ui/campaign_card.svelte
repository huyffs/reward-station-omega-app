<script lang="ts">
	import type { CampaignWithNfts } from '$lib/store/campaign_with_nfts_store';
	import { buildEngage, claimCoupon, engageStore } from '$lib/store/engage_store';
	import { wallet } from '$lib/store/wallet_store';
	import { getModalStore, getToastStore } from '@skeletonlabs/skeleton';
	import TaskForm from './task_form.svelte';
	import { userStore } from '$lib/store/user_store';
	import { derived } from 'svelte/store';
	import ProfileForm from '$lib/form/profile_form.svelte';
	import { chainId, signerAddress } from 'svelte-wagmi';
	import { auth } from '$lib/firebase';
	import { patchJSON, putJSON } from '$lib/util/fetch';
	import { PUBLIC_API_URL } from '$env/static/public';
	import type { UpdateResult } from '$lib/type/api';
	import { NETWORKS } from '$lib/store/nft_store';
	import { switchNetwork } from '@wagmi/core';

	const modalStore = getModalStore();
	const toastStore = getToastStore();

	export let campaign: CampaignWithNfts;

	$: canParticipate = !!campaign.nfts.length;
	let countryId = '';

	const engage = derived([wallet, engageStore], ([$wallet, $engageStore]) => {
		if ($wallet.linked && $wallet.chainId && $wallet.signerAddress) {
			const key = `${campaign.id}/${$wallet.chainId}/${$wallet.signerAddress}`;
			const p = $engageStore[key];
			countryId = p?.country_id?.toString() || '';
			return p;
		}
	});

	async function showProofForm(taskId: string) {
		modalStore.trigger({
			type: 'component',
			component: {
				ref: TaskForm,
				props: {
					campaignId: campaign.id,
					taskId
				}
			},
			backdropClasses: 'pointer-events-none'
		});
	}

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

	async function onCountryFormSubmit() {
		if (!countryId) {
			toastStore.trigger({
				message: 'Please select your country',
				background: 'variant-filled-error'
			});
			return;
		}

		const country_id = parseInt(countryId, 10);

		const chain_id = $chainId;
		const signer_address = $signerAddress?.toLowerCase();
		if (!auth.currentUser || !chain_id || !signer_address) {
			toastStore.trigger({
				message: 'You must be signed in and connect to your wallet to continue',
				background: 'variant-filled-error'
			});
			return;
		}

		const id = `${campaign.id}/${chain_id}/${signer_address}`;
		const path = `${chain_id}/${signer_address}/${campaign.id}`;

		if ($engageStore[id]) {
			const res = await patchJSON(`${PUBLIC_API_URL}/tasks/${path}`, {
				country_id
			});
			if (res.ok) {
				const data: UpdateResult = await res.json();
				engageStore.update((s) => {
					s[id] = buildEngage({
						...s[id],
						country_id,
						updated_at: data.updated_at
					});
					return s;
				});
				toastStore.trigger({
					message: 'Success!',
					background: 'variant-filled-success'
				});
				modalStore.close();
			} else {
				toastStore.trigger({
					message: `${res.status}: ${await res.text()}`,
					background: 'variant-filled-error'
				});
			}
		}
	}

	async function onCouponClaimClick() {
		const url = await claimCoupon(campaign.id, $wallet.chainId!, $wallet.signerAddress!);
		if (url) {
			toastStore.trigger({
				message: 'Success',
				background: 'variant-filled-success'
			});
			return;
		} else {
			toastStore.trigger({
				message: 'Something went wrong',
				background: 'variant-filled-error'
			});
			return;
		}
	}
</script>

<div id="campaign-{campaign.id}" class="flex flex-col sm:flex-row gap-4">
	<div
		class="card card-hover bg-primary rounded-3xl p-8 sm:basis-2/6 drop-shadow-[0_0_60px_rgba(0,0,0,0.08)]"
	>
		<header class="mb-4">
			<h3 class="h3">{campaign.name}</h3>
			{#if campaign.chain_id}
				<p class="text-surface-400">
					{NETWORKS[campaign.chain_id].name}
				</p>
			{/if}
		</header>
		<section class="flex items-start gap-8">
			<p>{campaign.description}</p>
		</section>
		<footer class="mt-4">
			<p class="badge variant-filled-warning">{campaign.condition_info}</p>
		</footer>
	</div>
	<div
		class="card rounded-3xl bg-primary sm:basis-1/6 p-4 flex flex-col justify-center text-center drop-shadow-[0_0_60px_rgba(0,0,0,0.08)]"
	>
		{#if campaign.images.length}
			<img src={campaign.images[0]} alt="" />
		{/if}
		<p class="">{campaign.reward_info}</p>
	</div>
	<div class="sm:basis-3/6 list flex flex-col gap-2">
		{#if $engage}
			{#if $engage.coupon_url}
				<div class="card p-2 flex">
					<span class="self-center flex-1">🎉 Your reward is here</span>
					<a
						href={$engage.coupon_url}
						target="_blank"
						class="btn variant-filled-primary justify-self-center">Get it now!</a
					>
				</div>
			{:else if $engage.coupon_serial}
				<span class="self-center flex-1">🎉 Your reward is ready</span>
				<button class="btn variant-filled-primary self-center" on:click={onCouponClaimClick}
					>Claim it now!</button
				>
			{:else if $engage.submitted === $engage.approved}
				<div class="card p-2 flex">
					{#if !$userStore?.user.displayName}
						<span class="self-center flex-1">Update your name to claim your reward!</span>
						<button class="btn variant-filled-primary w-xl" on:click={onEditNameClick}
							>Update name</button
						>
					{:else if !$engage.country_id}
						<span class="self-center flex-1">Select a country to claim your reward!</span>
					{:else}
						<span class="self-center flex-1"
							>🎉 All tasks have been approved, you will receive your reward in your email box soon!</span
						>
					{/if}
				</div>
			{/if}
			<form
				class="card p-2 flex gap-4 space-between"
				on:submit|preventDefault={onCountryFormSubmit}
			>
				<label class="label flex-1">
					<span>Reward country</span>
					<select
						class="select"
						bind:value={countryId}
						disabled={!!($engage.coupon_url || $engage.coupon_serial)}
						placeholder="Reward country..."
					>
						<option value="344">Hong Kong</option>
						<option value="446">Macau</option>
						<option value="392">Japan</option>
						<option value="826">United Kingdom</option>
						<option value="840">United States</option>
					</select>
				</label>
				<button
					disabled={!!($engage.coupon_url || $engage.coupon_serial)}
					class="btn variant-filled-primary self-center">Update</button
				>
			</form>
		{/if}
		{#if $wallet.linked}
			{#if campaign.chain_id && $chainId !== campaign.chain_id}<button
					on:click={() => {
						switchNetwork({
							chainId: campaign.chain_id || 1
						}).then(console.log);
					}}
					class="btn variant-filled-primary">Switch to {NETWORKS[campaign.chain_id].name}</button
				>
			{:else if !canParticipate}
				<span class="badge variant-filled-warning"
					>Condition not met: {campaign.condition_info}</span
				>
			{/if}
		{:else if !$userStore || !$wallet.id}
			<a class="btn variant-filled-primary" href="/me">Connect to enter</a>
		{/if}
		{#each campaign.tasks as task}
			<li class="card bg-primary px-4 py-2">
				<span class="flex-1">{task.name}</span>
				{#if $engage?.accepted[task.id]}
					<span class="badge variant-ghost-success bg-green-50">✅ Accepted</span>
				{:else if $engage?.messages[task.id]}
					<span class="badge variant-ghost"
						>👉
						{$engage.messages[task.id]}</span
					>
				{:else if $engage?.submissions[task.id]}
					<span class="badge variant-ghost-warning bg-yellow-50">🤞 In review</span>
				{:else if canParticipate && $wallet.linked}
					<button
						class="btn variant-filled-secondary bg-orange-500 no-underline py-1 px-9"
						on:click={() => showProofForm(task.id)}>Enter</button
					>
				{/if}
			</li>
		{/each}
	</div>
</div>
