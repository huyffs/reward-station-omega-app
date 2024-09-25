<script lang="ts">
	import { allProjects, useProjectStore } from '$lib/store/project_store';
	import type { PageData } from './$types';
	import { derived } from 'svelte/store';

	export let data: PageData;
	const { projects } = data;

	const projectStore = useProjectStore();
	projectStore.insertAllRaw(projects);

	const featuredProjects = derived(allProjects, ($allProjects) => {
		const t = new Date().getTime();
		return $allProjects.filter(
			(p) =>
				p.featureFrom &&
				p.featureFrom.getTime() < t &&
				(!p.featureUntil || p.featureUntil.getTime() > t)
		);
	});
</script>

<section class="max-w-screen-2xl mx-auto px-4">
	<div
		class="w-screen mix-blend-luminosity bg-[url(/assets/polka.png)] absolute top-2 left-0 h-4/5 max-h-[600px] -z-10"
	></div>
	<header class="pt-20 lg:pt-32 text-center gap-10 flex flex-col items-center justify-center">
		<div class="flex flex-col lg:flex-row text-4xl lg:text-[56px] font-bold gap-1 lg:gap-3">
			<div>Start Your Loyalty</div>
			<div class="text-[#BD8CE8]">Rewards Journey</div>
		</div>
		<p class="font-normal text-lg lg:text-[22px] text-white/70">
			Join Club loyalty programs, complete tasks and earn rewards!
		</p>
		<div class="flex gap-2 lg:gap-4 flex-col lg:flex-row mt-8 w-max items-center h-max">
			<a
				href="/me?mode=sign_in"
				class="px-6 py-2 duration-300 cursor-pointer w-max outline outline-transparent hover:outline-white/20 outline-offset-2 bg-neutral-700 rounded-full text-white text-2xl lg:text-2xl font-raleway"
			>
				Sign In
			</a>
			<a
				href="/me"
				class="flex gap-2 duration-300 cursor-pointer outline outline-transparent hover:outline-white/20 outline-offset-2 items-center justify-center px-6 py-2 bg-gradient-to-r from-[#515eab] to-[#724786] rounded-full text-white text-2xl lg:text-2xl font-raleway"
			>
				Get Started <svg
					class="h-6 aspect-square"
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
							stroke="#fff"
							stroke-width="1.5"
							stroke-linecap="round"
							stroke-linejoin="round"
						></path>
					</g></svg
				>
			</a>
		</div>
	</header>
	<content class="my-8 block">
		{#if $featuredProjects.length}
			<div
				class="snap-x scroll-px-4 snap-mandatory scroll-smooth overflow-y-visible flex gap-8 overflow-x-auto px-1 md:px-4 py-10 pt-20"
			>
				{#each $featuredProjects as project}
					<div
						class="mx-auto rounded-3xl bg-[#23232C] p-2 w-full max-w-5xl h-max flex flex-col md:flex-col overflow-visible gap-2 relative"
					>
						<div class="absolute lg:flex hidden -top-20 -left-20 -z-10 h-40 aspect-square">
							<img src="/assets/metacrown.svg" alt="RewardStationOmega Crown" />
						</div>
						<div class="absolute flex lg:hidden -top-16 right-4 -z-10 h-24 aspect-square">
							<img src="/assets/metacrown-mobile.svg" alt="RewardStationOmega Crown" />
						</div>
						<div class="px-2 text-white/60 text-xl font-medium">✦&nbsp;&nbsp;Featured Club</div>
						<div class="rounded-3xl w-full h-full flex flex-col md:flex-row bg-[#191922] p-4">
							<a
								href="/clubs/{project.id}"
								class="h-full w-auto max-w-xs rounded-2xl overflow-hidden"
							>
								<img
									src={project.logo}
									alt="genesis nft"
									class="object-cover w-full h-64 md:h-full"
								/>
							</a>
							<main class="flex flex-col justify-between gap-2 py-6 pb-2 lg:py-4 px-0 lg:px-7">
								<div class="flex flex-col gap-2 lg:gap-4">
									<h2 class="text-[22px] md:text-[28px] font-medium">{project.name}</h2>
									<p class="text- lg:text-[17px] leading-tighter font-regular text-white/60">
										{project.description}
									</p>
								</div>
								<a
									href="/clubs/{project.id}"
									class="text-lg lg:text-xl mt-4 lg:mt-0 underline underline-offset-4 text-blue-100 decoration-1"
								>
									Visit Club
								</a>
							</main>
						</div>
					</div>
				{/each}
			</div>
		{/if}
		<div class="w-full max-w-screen-2xl px-0 lg:px-20 flex flex-col gap-4 mt-24">
			<div class="h-0 w-full border-t border-white/10"></div>

			<h2 class="h2 text-3xl font-medium font-raleway mt-8 mb-4">Explore Clubs</h2>
			<div class="grid md:grid-cols-2 gap-4">
				{#each $allProjects as project, i}
					<a
						class="bg-gradient-to-br from-[#202027] to-[#1e1e24] duration-200 hover:scale-[0.98] hover:ring-1 ring-white/40 p-2 rounded-3xl overflow-hidden h-max lg:h-48 flex flex-col lg:flex-row gap-1 lg:gap-4"
						href="/clubs/{project.id}"
					>
						<header class="lg:basis-1/3 h-56 lg:h-auto rounded-2xl overflow-hidden">
							<img src={project.logo} alt="Project" class="w-full h-full object-cover" />
						</header>
						<div
							class="px-2 lg:px-3 py-2 basis-2/3 max-h-40 lg:max-h-none flex flex-col gap-1 relative overflow-hidden"
						>
							<h2 class="text-xl lg:text-2xl font-semibold">{project.name}</h2>
							<p class="overflow-y-auto flex-auto text-white/60 text-[15px] md:text-base">
								{project.description}
							</p>
						</div>
					</a>
				{/each}
			</div>
		</div>
	</content>
</section>
