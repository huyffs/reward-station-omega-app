<script lang="ts">
	import { walletLinked } from '$lib/store/wallet_store';
	import type { PageData } from './$types';
	import { useProjectStore } from '$lib/store/project_store';
	import { projectMemberships } from '$lib/store/project_membership_store';
	import { projectMembershipStore } from '$lib/store/project_membership_store';
	import ClubCard from '$lib/ui/club_card.svelte';
	import { userStore } from '$lib/store/user_store';
	import { derived } from 'svelte/store';

	export let data: PageData;
	const { projects } = data;

	const projectStore = useProjectStore();
	projectStore.insertAllRaw(projects);

	const clubs = derived([userStore, projectStore], ([$userStore, $projectStore]) => {
		if ($userStore) {
			const project_ids = Object.keys($projectStore);
			if (project_ids.length) {
				return project_ids;
			}
		}
	});

	$: if ($clubs) {
		projectMembershipStore.fetchAll({ query: { project_ids: $clubs.join(',') } });
	}
</script>

<div class="mt-20 max-w-screen-xl mx-4 lg:mx-auto">
	<div
		class="w-screen mix-blend-luminosity bg-[url(/assets/polka.png)] absolute top-2 left-0 h-3/5 max-h-[600px] -z-10"
	></div>
	<div class="w-full gap-6 flex items-center justify-center">
		<h2 class="text-3xl font-raleway mt-8 mb-4">Your Clubs</h2>
		<div class="flex-grow h-0 border-y rounded-full mt-3 border-white/20"></div>
	</div>
	{#if $walletLinked}
		{#if $projectMemberships.length == 0}
			<header
				class="rounded-3xl flex flex-col items-center gap-12 mt-4 bg-[#18181f] lg:bg-[#101015] to-90% px-8 py-10 lg:p-24 text-center"
			>
				<div class="flex flex-col gap-2">
					<span class="block text-2xl lg:text-3xl font-medium text-white/60"
						>No clubs to display.</span
					>
					<span class="block text-lg text-white/40">You haven't joined any club yet.</span>
				</div>
			</header>
		{:else}
			<div class="flex-1 grid gap-4 md:grid-cols-2">
				{#each $projectMemberships as project}
					<ClubCard {project} class="" />
				{/each}
			</div>
		{/if}
	{:else}
		<header
			class="rounded-3xl flex flex-col items-center gap-12 mt-4 bg-[#18181f] lg:bg-[#101015] to-90% px-8 py-10 lg:p-24 text-center"
		>
			<div class="flex flex-col gap-2">
				<span class="block text-2xl lg:text-3xl font-medium text-white/60"
					>Whoops! Seems like you aren't logged in</span
				>
				<span class="block text-lg text-white/40">You must be logged in to access this page.</span>
			</div>
			<a
				href="/me?mode=sign_in"
				class="bg-gradient-to-r w-max outline outline-offset-2 outline-transparent hover:outline-purple-300/10 duration-300 from-[#454f8c] to-[#6c427f] py-2 px-6 text-xl rounded-full font-raleway font-medium"
				>Proceed to Login</a
			>
		</header>
	{/if}
	<div class="w-full h-20"></div>
</div>
