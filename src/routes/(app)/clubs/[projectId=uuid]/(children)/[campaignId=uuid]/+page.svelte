<script lang="ts">
	import { useCampaignStore } from '$lib/store/campaign_store';
	import type { PageData } from './$types';
	import { page } from '$app/stores';
	import { Accordion, AccordionItem, getModalStore } from '@skeletonlabs/skeleton';
	import { derived } from 'svelte/store';
	import { NETWORKS, myNfts } from '$lib/store/nft_store';
	import { wallet, walletLinked } from '$lib/store/wallet_store';
	import { engageStore } from '$lib/store/engage_store';
	import TaskForm from '$lib/ui/task_form.svelte';
	import { chainId } from 'svelte-wagmi';
	import { switchNetwork } from '@wagmi/core';
	import { useCampaignRewardStore } from '$lib/store/campaign_reward_store';
	import CampaignRewardCard from '$lib/ui/campaign_reward_card.svelte';
	import { campaignnParticipationStore } from '$lib/store/campaign_participation_store';
	import { onMount } from 'svelte';

	export let data: PageData;
	const { campaign: rawCampaign, rewards: rawRewards } = data;

	const campaignRewardStore = useCampaignRewardStore($page.params.campaignId);
	campaignRewardStore.insertAllRaw(rawRewards);

	const allCampaignRewards = derived(campaignRewardStore, ($campaignRewardStore) => {
		return Object.values($campaignRewardStore)
			.filter((r) => r.campaign_id === $page.params.campaignId)
			.sort((a, b) => a.point - b.point);
	});

	const modalStore = getModalStore();
	const campaignStore = useCampaignStore();
	campaignStore.insertRaw(rawCampaign);

	const campaign = derived(campaignStore, ($campaignStore) => {
		return $campaignStore[$page.params.campaignId];
	});

	const canParticipate = derived(myNfts, ($myNfts) =>
		$myNfts.find((nft) => nft.contract === $campaign.contract_address)
	);

	let countryId = '';

	const engage = derived([wallet, engageStore, campaign], ([$wallet, $engageStore, $campaign]) => {
		if ($campaign && $wallet.linked && $wallet.chainId && $wallet.signerAddress) {
			const key = `${$campaign.id}/${$wallet.chainId}/${$wallet.signerAddress}`;
			const p = $engageStore[key];
			countryId = p?.country_id?.toString() || '';
			return p;
		}
	});

	const tasks = derived([campaign, engage], ([$campaign, $engage]) => {
		return $campaign.tasks.map((task) => {
			return {
				...task,
				accepted: $engage?.accepted[task.id] || false,
				hasMessage: $engage?.messages[task.id] || false,
				submitted: $engage?.submissions[task.id] || false
			};
		});
	});

	$: campaignnParticipation = $walletLinked
		? $campaignnParticipationStore[$page.params.campaignId]
		: undefined;

	onMount(() => {
		if (!campaignnParticipation) {
			campaignnParticipationStore.fetchOne($page.params.campaignId);
		}
	});

	async function showProofForm(taskId: string) {
		modalStore.trigger({
			type: 'component',
			component: {
				ref: TaskForm,
				props: {
					campaignId: $campaign.id,
					taskId
				}
			},
			backdropClasses: 'pointer-events-none'
		});
	}
</script>

<div
	class="w-screen mix-blend-luminosity bg-[url(/assets/polka.png)] absolute top-2 left-0 h-4/5 max-h-[600px] -z-10"
></div>
<div class="w-screen max-w-screen-lg mx-4 lg:mx-auto">
	<a
		href="/clubs/{$page.params.projectId}"
		class="w-max px-2 gap-2 h-max flex items-center justify-start mt-24 mb-4 text-2xl font-raleway font-medium text-white/60 stroke-white/60 hover:stroke-white duration-300 hover:text-white cursor-pointer"
	>
		<svg
			class="h-6 aspect-square -scale-x-100"
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g
				id="SVGRepo_tracerCarrier"
				stroke-linecap="round"
				stroke-linejoin="round"
			></g><g id="SVGRepo_iconCarrier">
				<path
					d="M20 12L4 12M20 12L14 18M20 12L14 6"
					stroke-width="1.5"
					stroke-linecap="round"
					stroke-linejoin="round"
				></path>
			</g></svg
		>
		Back to club
	</a>
</div>
<section
	class="max-w-screen-lg p-6 bg-[#131318] rounded-[32px] border border-white/5 shadow-2xl mx-4 lg:mx-auto px-4"
>
	{#if $campaign}
		<div class="flex flex-col lg:flex-row h-max pb-4 px-2 border-b border-white/10">
			<div
				class="h-72 aspect-square bg-gradient-to-br from-white/[0.02] to-white/5 border border-white/15 rounded-2xl p-2"
			>
				<img
					src={$campaign.logo}
					class="rounded-xl object-cover w-full h-full"
					alt="Project logo"
				/>
			</div>
			<div class="flex-grow flex flex-col items-start lg:pl-8 pl-2 gap-2 pt-6">
				<h2 class="text-3xl font-raleway font-medium">{$campaign.name}</h2>
				<div class="text-base text-white/50">
					{$campaign.description}
				</div>
			</div>
		</div>
		<div class="grid grid-cols-2 md:grid-cols-4 gap-2 mt-4 border-b border-white/10 pb-4">
			<div class="flex-col flex bg-black/30 px-5 py-3 rounded-2xl border border-white/5">
				<dt class="text-white opacity-50 font-raleway text-l">Network:</dt>
				<dd class="text-xl text-white/75 font-medium tracking-wide">
					{$campaign.chain_id ? NETWORKS[$campaign.chain_id].name : 'not set'}
				</dd>
			</div>
			<div class="flex-col flex bg-black/30 px-5 py-3 rounded-2xl border border-white/5">
				<dt class="text-white opacity-50 font-raleway text-l">Tasks:</dt>
				<dd class="text-xl text-white/75 font-medium tracking-wide">{$campaign.tasks.length}</dd>
			</div>
			<div class="flex-col flex bg-black/30 px-5 py-3 rounded-2xl border border-white/5">
				<dt class="text-white opacity-50 font-raleway text-l">Start:</dt>
				<dd class="text-xl text-white/75 font-medium tracking-wide">
					{$campaign.startAt?.toLocaleDateString()}
				</dd>
			</div>
			{#if $campaign.endAt}
				<div class="flex-col flex bg-black/30 px-5 py-3 rounded-2xl border border-white/5">
					<dt class="text-white opacity-50 font-raleway text-l">End:</dt>
					<dd class="text-xl text-white/75 font-medium tracking-wide">
						{$campaign.endAt.toLocaleDateString()}
					</dd>
				</div>
			{/if}
		</div>
		<div class="w-full h-max bg-black/20 rounded-2xl py-8 text-center my-4 px-4">
			{#if $canParticipate}
				<div
					class="text-xl md:text-2xl lg:text-3xl font-raleway underline font-medium text-white/75 decoration-1 underline-offset-4 decoration-white/20"
				>
					Requirement met 🎉
				</div>
			{:else}
				<div
					class="text-xl md:text-2xl lg:text-3xl font-raleway underline font-medium text-white/75 decoration-1 underline-offset-4 decoration-white/20"
				>
					Requirement not met 🥲
				</div>
				{#if $wallet.id && $campaign.chain_id && $chainId !== $campaign.chain_id}
					<button
						on:click={() => {
							switchNetwork({
								chainId: $campaign.chain_id || 1
							}).then(console.log);
						}}
						class="btn block variant-filled-primary mx-auto my-4"
						>Switch to {NETWORKS[$campaign.chain_id].name}</button
					>
				{/if}
			{/if}
			{#if $walletLinked}
				<p class="text-white/70">To participate, you must:</p>
				<div
					class="font-medium text-xl text-white/80 flex flex-wrap gap-2 bg-white/5 w-full items-center mt-2 md:w-max justify-center  h-max mx-auto px-5 py-3 rounded-xl"
				>
					<span class="">
						{$campaign.condition_info}
					</span>
					{#if $campaign.chain_id}
						<span>on</span>
						<span class="font-bold">{NETWORKS[$campaign.chain_id].name}</span>
					{/if}
				</div>
			{:else}
				<span class="block m-4">Sign in to participate</span>
				<a href="/me?mode=sign_in" class="btn variant-filled-primary">Sign in</a>
			{/if}
		</div>
		<div class="bg-black/20 rounded-2xl py-4 px-6">
			<h2
				class="text-xl md:text-2xl lg:text-3xl font-raleway underline underline-offset-4 decoration-1 decoration-white/40 my-4 text-center"
			>
				Tasks
			</h2>
			<Accordion>
				{#each $tasks as task}
					<AccordionItem
						padding="px-5 py-4 mb-2"
						regionControl="border border-white/5"
						regionPanel="w-[calc(100%-1rem)] ml-2 p-0 mb-4 -mt-2 bg-white/[0.02] rounded-t-none rounded-xl p-4 text-center text-white/70"
						rounded="rounded-[14px]"
						regionCaret="w-7 h-7 p-1.5  flex justify-center items-center rounded-full border border-white/30"
						hover="bg-white/[0.025]  flex-col lg:flex-row gap-3 flex rounded-3xl"
						open={$canParticipate && !(task.submitted || task.accepted)}
					>
						<svelte:fragment slot="lead">
							<span class="text-lg font-raleway text-white/60">{task.name}</span>
						</svelte:fragment>
						<svelte:fragment slot="summary">
							<div class="flex gap-4 justify-end">
								{#if task.point}
									<span
										class="px-3 py-1 bg-gradient-to-br from-blue-900/40 to-purple-900/40 rounded-xl text-white/80"
										>+{task.point} points</span
									>
								{/if}
								{#if task.accepted}
									<span class="badge variant-soft-success bg-green-50">✅ Accepted</span>
								{:else if $engage?.messages[task.id]}
									<span class="badge variant-soft"
										>👉
										{$engage.messages[task.id]}</span
									>
								{:else if task.submitted}
									<span class="badge variant-soft-warning bg-yellow-50">🤞 In review</span>
								{:else}
									<span class="badge variant-soft bg-slate-50">👇 To do</span>
								{/if}
							</div>
						</svelte:fragment>
						<svelte:fragment slot="content">
							<p>{task.description}</p>
							<a class="anchor" target="_blank" href={task.link}>{task.link}</a>
							{#if !$engage?.accepted[task.id] && !$engage?.messages[task.id] && !$engage?.submissions[task.id] && $canParticipate && $wallet.linked}
								<button
									class="btn variant-soft-tertiary hover:variant-filled-tertiary no-underline"
									on:click={() => showProofForm(task.id)}>Enter task</button
								>
							{/if}
						</svelte:fragment>
					</AccordionItem>
				{/each}
			</Accordion>
		</div>
	{/if}

	{#if campaignnParticipation}
		<div class="card p-4 text-center">
			My campaign points: {campaignnParticipation.point} minted, {campaignnParticipation.balance} available
		</div>
	{/if}
	<div class="bg-black/20 rounded-2xl my-4 py-4 px-6">
		<h2
			class="text-xl md:text-2xl lg:text-3xl font-raleway underline underline-offset-4 decoration-1 decoration-white/40 my-4 text-center"
		>
			Rewards
		</h2>
		{#if $allCampaignRewards.length}
			<div class="flex flex-col gap-4 mt-8">
				{#each $allCampaignRewards as reward}
					<CampaignRewardCard campaignReward={reward} {reward} {campaignnParticipation} class="" />
				{/each}
				{#if $allCampaignRewards.length % 2}
					<div class="" />
				{/if}
			</div>
		{:else}
			No reward available
		{/if}
	</div>
</section>
