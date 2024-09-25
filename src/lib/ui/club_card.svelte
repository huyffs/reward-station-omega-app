<script lang="ts">
	import type { Project } from '$lib/store/project_store';
	import IntroCard from './intro_card.svelte';
	import { projectMembershipStore } from '$lib/store/project_membership_store';

	export let project: Project;
	let clazz: string = '';
	export { clazz as class };

	$: pm = $projectMembershipStore[project.id];
</script>

<IntroCard
	logo={project.logo}
	href="/clubs/{project.id}"
	title={project.name}
	intro={project.description}
	class={clazz}
>
	<svelte:fragment slot="body">
		{#if pm}
			<div class="text-xl font-medium bg-gradient-to-br from-blue-900/50 to-purple-900/50 px-4 py-1 h-max rounded-xl text-white/80 flex items-center justify-center">{pm.point?.toLocaleString() || 0} XP</div>
		{/if}
	</svelte:fragment>
</IntroCard>
