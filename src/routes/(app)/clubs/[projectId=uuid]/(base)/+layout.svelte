<script lang="ts">
	import { useProjectStore } from '$lib/store/project_store';
	import type { PageData } from './$types';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { projectMembershipStore } from '$lib/store/project_membership_store';
	import Fa from 'svelte-fa';
	import { faGamepad, faGlobe, faMailBulk, faX } from '@fortawesome/free-solid-svg-icons';
	import { walletLinked } from '$lib/store/wallet_store';
	import { doFetch } from '$lib/util/fetch';
	import { PUBLIC_API_URL } from '$env/static/public';
	import { getToastStore } from '@skeletonlabs/skeleton';
	import { userStore } from '$lib/store/user_store';

	export let data: PageData;
	const { project: rawProject } = data;

	const projectStore = useProjectStore();
	projectStore.insertRaw(rawProject);

	const toastStore = getToastStore();

	onMount(() => {
		if ($userStore?.user) {
			projectMembershipStore.fetchAll({ query: { project_ids: $page.params.projectId } });
		}
	});

	$: project = $projectStore[$page.params.projectId];
	$: projectMembership = $projectMembershipStore[$page.params.projectId];

	async function onJoinClick() {
		const res = await doFetch(`${PUBLIC_API_URL}/clubs`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				project_id: $page.params.projectId
			})
		});
		if (res.ok) {
			const data = await res.json();
			projectMembershipStore.update((s) => {
				s[$page.params.projectId] = {
					...s[$page.params.projectId],
					subscribed: true
				};
				return s;
			});
			console.log(data);
			toastStore.trigger({
				message: 'Joined successfully!',
				background: 'variant-filled-success'
			});
		} else {
			toastStore.trigger({
				message: `Failed to mint coupon: ${await res.text()}`,
				background: 'variant-filled-error'
			});
		}
	}
</script>

{#if project}
	<div class="w-screen max-w-screen-lg mx-4 lg:mx-auto">
		<a
			href="/"
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
			Go Back
		</a>
	</div>
	<div
		class="w-screen mix-blend-luminosity bg-[url(/assets/polka.png)] absolute top-2 left-0 h-4/5 max-h-[600px] -z-10"
	></div>
	<section
		class="lg:mx-auto mx-4 mb-20 max-w-screen-lg py-6 px-4 md:px-6 bg-[#131318] rounded-[32px] border border-white/5 shadow-2xl"
	>
		<header>
			<div class="flex flex-col lg:flex-row h-max pb-4 border-b border-white/10">
				<div
					class="h-40 lg:h-72 w-max aspect-square bg-gradient-to-br from-white/[0.02] to-white/5 border border-white/15 rounded-2xl p-2"
				>
					<img
						src={project.logo}
						class="rounded-xl object-cover w-full h-full"
						alt="Project logo"
					/>
				</div>
				<div class="flex-grow flex flex-col items-start lg:pl-8 gap-10 pt-6">
					<div class="flex flex-col w-full justify-center items-start gap-4">
						<h2 class="text-3xl font-raleway">{project.name}</h2>
						<div class="flex flex-row gap-1.5">
							{#if project.networks.twitter}
								<div
									class="bg-gradient-to-br items-center justify-center flex flex-row gap-2.5 from-white/5 to-white/10 text-base border border-white/20 text-white/60 px-3 py-0.5 rounded-full font-normal"
								>
									<Fa icon={faX} />
									Twitter
								</div>
							{/if}
							{#if project.networks.telegram}
								<div
									class="bg-gradient-to-br items-center justify-center flex flex-row gap-2.5 from-white/5 to-white/10 text-base border border-white/20 text-white/60 px-3 py-0.5 rounded-full font-normal"
								>
									<Fa icon={faMailBulk} />
									Telegram
								</div>
							{/if}
							{#if project.networks.discord}
								<div
									class="bg-gradient-to-br items-center justify-center flex flex-row gap-2.5 from-white/5 to-white/10 text-base border border-white/20 text-white/60 px-3 py-0.5 rounded-full font-normal"
								>
									<Fa icon={faGamepad} />
									Discord
								</div>
							{/if}
							{#if project.website}
								<a
									href={project.website}
									class="bg-gradient-to-br items-center justify-center flex flex-row gap-2.5 from-white/5 to-white/10 text-base border border-white/20 text-white/60 px-3 py-0.5 rounded-full font-normal"
								>
									<Fa icon={faGlobe} />
									Website
								</a>
							{/if}
						</div>
						<div class="text-base font-inter text-white/70 pr-4">{project.description}</div>
					</div>
					{#if !$walletLinked}
					<div class="flex flex-col md:flex-row gap-2 w-max">

						<h4 class="text-lg">Sign in to earn points!</h4>
						<a href="/me" class="px-5 py-2 w-max h-max bg-green-800 rounded-xl">Sign in</a>
					</div>
					{:else if projectMembership}
						<h2 class="h2 text-primary-500 font-bold">Club Joined!</h2>
						<p>My points: {projectMembership?.point || '--'}</p>
					{:else}
						<button
							class="py-1 px-5 font-inter font-medium text-lg tracking-wide flex gap-2 duration-300 cursor-pointer outline outline-transparent hover:outline-white/20 outline-offset-2 items-center justify-center bg-gradient-to-r from-[#515eab] to-[#724786] rounded-full text-white font-raleway"
							on:click={onJoinClick}>Join Club</button
						>
					{/if}
				</div>
			</div>
		</header>
		<content class="block mt-8">
			<div class="flex around gap-4 items-center justify-start lg:pl-8">
				{#if $page.url.pathname.endsWith('/rewards')}
				<a
					href="/clubs/{project.id}"
					class="text-xl font-raleway px-5 py-1.5 border-2 border-white/10 rounded-t-xl border-b-[#0D0D11] bg-[#0D0D11] border-b-0 translate-y-0 text-white/40"
					>Campaigns</a
					> 
					<a
					href="/clubs/{project.id}/rewards"
					class={'text-xl font-raleway px-5 py-1.5 border-2 border-purple-600/70 rounded-t-xl border-b-[#0D0D11] bg-[#0D0D11] translate-y-0.5 text-white/80'}
					>Rewards</a
				>
				{:else}
				<a
					href="/clubs/{project.id}"
					class={'text-xl font-raleway px-5 py-1.5 border-2 border-purple-600/70 rounded-t-xl border-b-[#0D0D11] bg-[#0D0D11] translate-y-0.5 text-white/80'}
					>Campaigns</a
				> 
				<a
					href="/clubs/{project.id}/rewards"
					class="text-xl font-raleway px-5 py-1.5 border-2 border-white/10 rounded-t-xl border-b-[#0D0D11] bg-[#0D0D11] border-b-0 translate-y-0 text-white/40"
					>Rewards</a
				>
				{/if}
			</div>
			<div class="w-full h-max border-t-2 border-purple-600/70 shadow-xl bg-black/30 p-2 lg:p-6 pb-32">
				<slot />
			</div>
		</content>
	</section>
{/if}
