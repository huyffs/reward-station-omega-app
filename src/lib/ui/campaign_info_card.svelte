<script lang="ts">
	import type { Campaign } from '$lib/store/campaign_store';
	import InfoCard from './info_card.svelte';

	export let projectId: string;
	export let campaign: Campaign;
	let clazz: string = '';
	export { clazz as class };
</script>

<InfoCard
	logo={campaign.logo}
	href="{projectId}/{campaign.id}"
	title={campaign.name}
	intro={campaign.description}
	class={clazz}
>
	<svelte:fragment slot="footer">
		<dl class="w-full flex flex-col lg:flex-row items-start justify-start lg:items-center gap-3">
			<div
				class="rounded-xl px-3 font-medium flex justify-center items-center gap-2 py-0.5 bg-gradient-to-r from-[#515eab] to-[#724786] text-white"
			>
				<svg
					width="15"
					height="15"
					viewBox="0 0 15 15"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M7.36364 11.0114L3.06818 14.1136L4.76136 9.06818L0.454545 5.95455H5.72727L7.36364 0.90909L9 5.95455H14.2727L9.96591 9.06818L11.6591 14.1136L7.36364 11.0114Z"
						fill="white"
					/>
				</svg>

				{campaign.tasks.reduce((a, t) => {
					a += t.point ?? 0;
					return a;
				}, 0)} points
			</div>
			{#if campaign.endAt}
				<div
					class="rounded-xl px-3 font-medium flex justify-center items-center gap-2 py-0.5 bg-white/10 text-white/80"
				>
					End: {campaign.endAt.toLocaleDateString()}
				</div>
			{/if}
		</dl>
	</svelte:fragment>
</InfoCard>
