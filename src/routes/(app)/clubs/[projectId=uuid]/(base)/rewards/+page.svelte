<script lang="ts">
	import type { PageData } from './$types';
	import { page } from '$app/stores';
	import { derived } from 'svelte/store';
	import { onMount } from 'svelte';
	import { projectMembershipStore } from '$lib/store/project_membership_store';
	import ProjectRewardCard from '$lib/ui/project_reward_card.svelte';
	import { useProjectRewaerdStore } from '$lib/store/project_reward_store';

	export let data: PageData;
	const { rewards: rawrewards } = data;

	const projectRewardStore = useProjectRewaerdStore($page.params.projectId);
	projectRewardStore.insertAllRaw(rawrewards);

	onMount(() => {
		projectMembershipStore.fetchAll({ query: { project_ids: $page.params.projectId } });
	});

	$: projectMembership = $projectMembershipStore[$page.params.projectId];

	const allProjectRewards = derived(projectRewardStore, ($projectRewardStore) => {
		return Object.values($projectRewardStore)
			.filter((r) => r.project_id === $page.params.projectId)
			.sort((a, b) => a.point - b.point);
	});
</script>

<div class="">
	<div class="flex gap-4 flex-col w-full">
		{#if $allProjectRewards.length}
			{#each $allProjectRewards as reward}
				<ProjectRewardCard {projectMembership} projectReward={reward} {reward} class="" />
			{/each}
			{#if $allProjectRewards.length % 2}
				<div class="md:w-96" />
			{/if}
		{:else}
			No reward available
		{/if}
	</div>
</div>
