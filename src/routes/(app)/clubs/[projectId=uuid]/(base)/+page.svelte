<script lang="ts">
	import { campaignStore } from '$lib/store/campaign_store';
	import type { PageData } from './$types';
	import { page } from '$app/stores';
	import { campaignWithNfts, type CampaignWithNfts } from '$lib/store/campaign_with_nfts_store';
	import { derived } from 'svelte/store';
	import CampaignInfoCard from '$lib/ui/campaign_info_card.svelte';

	export let data: PageData;
	const { campaigns } = data;

	campaignStore.insertAllRaw(campaigns);

	const allCampaigns = derived(campaignWithNfts, ($campaignWithNfts) => {
		const now = new Date().getTime();
		const present: CampaignWithNfts[] = [];
		const past: CampaignWithNfts[] = [];
		const future: CampaignWithNfts[] = [];
		for (const c of $campaignWithNfts) {
			if (c.project_id === $page.params.projectId) {
				if (c.endAt && c.endAt.getTime() < now) {
					past.push(c);
				} else if (c.startAt && c.startAt.getTime() <= now) {
					present.push(c);
				} else {
					future.push(c);
				}
			}
		}
		return { past, present, future };
	});
</script>

{#if $allCampaigns.present.length}
	<div class="flex flex-col gap-4">
		{#each $allCampaigns.present as campaign, i}
			<CampaignInfoCard projectId={$page.params.projectId} {campaign} class="max-h-96" />
		{/each}
	</div>
{:else}
	<div
		class="w-full h-28 bg-white/5 rounded-2xl flex items-center justify-center text-xl text-white/60"
	>
		No campaign running right now
	</div>
{/if}
{#if $allCampaigns.future.length}
	<h2 class="h2 my-4">Upcoming campaigns</h2>
	<div class="flex flex-col gap-4">
		{#each $allCampaigns.future as campaign, i}
			<CampaignInfoCard projectId={$page.params.projectId} {campaign} class="max-h-96" />
		{/each}
	</div>
{/if}
{#if $allCampaigns.past.length}
	<h2 class="h2 my-4">Expired campaigns</h2>
	<div class="flex flex-col gap-4 lg:grid lg:grid-cols-2">
		{#each $allCampaigns.past as campaign, i}
			<CampaignInfoCard projectId={$page.params.projectId} {campaign} class="max-h-96" />
		{/each}
	</div>
{/if}
