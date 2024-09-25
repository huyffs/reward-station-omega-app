<script lang="ts">
	import { PUBLIC_API_URL } from '$env/static/public';
	import type { RAW } from '$lib/store/async_store';
	import { couponStore, type Coupon } from '$lib/store/coupon_store';
	import {
		projectMembershipStore,
		type ProjectMembership
	} from '$lib/store/project_membership_store';
	import type { ProjectReward } from '$lib/store/project_reward_store';
	import type { Reward } from '$lib/store/reward_store';
	import { voucherStore } from '$lib/store/voucher_store';
	import { walletLinked } from '$lib/store/wallet_store';
	import { doFetch } from '$lib/util/fetch';
	import { getToastStore } from '@skeletonlabs/skeleton';

	export let projectMembership: ProjectMembership | undefined = undefined;
	export let reward: Reward;
	export let projectReward: ProjectReward | undefined = undefined;
	export let coupon: Coupon | undefined = undefined;
	let clazz: string = '';
	export { clazz as class };

	const toastStore = getToastStore();

	async function mint() {
		if (!projectReward) {
			return;
		}
		const projectId = projectReward.project_id;
		const res = await doFetch(
			`${PUBLIC_API_URL}/project-rewards/${projectReward.project_id}/${reward.id}`,
			{ method: 'POST' }
		);
		if (res.ok) {
			const data: { coupon: RAW; vouchers: RAW[]; balance: number } = await res.json();
			couponStore.insertRaw(data.coupon);
			voucherStore.insertAllRaw(data.vouchers);
			projectMembershipStore.update((s) => {
				const item = s[projectId];
				s[projectId] = {
					...item,
					balance: data.balance
				};
				return s;
			});
			toastStore.trigger({
				message: 'Minted successfully!',
				background: 'variant-filled-success'
			});
		} else {
			if (res.status === 404) {
				toastStore.trigger({
					message: `Sorry, this reward has been fully redeemed`,
					background: 'variant-filled-error'
				});
			} else {
				toastStore.trigger({
					message: `Failed to mint coupon: ${await res.text()}`,
					background: 'variant-filled-error'
				});
			}
		}
	}

	const img = reward.images.length ? reward.images[0] : '/merchants/_default.jpg';
</script>

<div
	class="rounded-3xl h-max lg:h-56 bg-white/[0.03] border border-white/5 p-2 overflow-hidden w-full flex flex-col lg:flex-row gap-4 {clazz}"
>
	<header class="h-full aspect-square rounded-2xl overflow-hidden">
		<img src={img} alt={reward.name} class="w-full h-full object-cover" />
	</header>
	<div class="p-4 pt-2 lg:pt-4 pb-4 basis-2/3">
		<h2 class="text-2xl fonra lg:mb-4 mb-2">{reward.name}</h2>
		<dl class="flex flex-col lg:flex-row w-full gap-2 lg:gap-10 border-b border-white/5 py-2 mb-6">
			<div class="flex gap-2 items-center">
				<dt class="text-surface-300">Country:</dt>
				<dd class="block rounded-xl bg-white/5 text-white/80 px-3 py-0.5">
					{reward.country_id ?? 'All'}
				</dd>
			</div>
			<div class="flex gap-2 items-center">
				<dt class="text-surface-300">Redeem:</dt>
				<dd class="block rounded-xl bg-white/5 text-white/80 px-3 py-0.5">
					{reward.validFrom && reward.validFrom.getTime() > new Date().getTime()
						? reward.validFrom.toLocaleDateString()
						: 'Now'}
				</dd>
			</div>
			<div class="flex gap-2 items-center">
				<dt class="text-surface-300">Expiry:</dt>
				<dd class="block rounded-xl bg-white/5 text-white/80 px-3 py-0.5">
					{reward.validUntil?.toLocaleDateString() || 'Never expire'}
				</dd>
			</div>
		</dl>
		<div class="mt-4 flex gap-2">
			{#if coupon}
				<a href={coupon.url} class="btn">Redeem</a>
			{:else if projectReward}
				<span
					class="bg-white/5 px-3 py-1.5 items-center flex border border-white/10 text-white/70 rounded-xl"
					>{projectReward.point} points</span
				>
				{#if $walletLinked}
					{#if projectMembership?.point && projectMembership.balance >= projectReward.point}
						<button class="btn variant-ghost-primary hover:variant-filled-primary" on:click={mint}
							>Mint</button
						>
					{:else}
						<button
							class="px-4 py-1.5 items-center flex rounded-xl bg-green-900/50 text-white/80 disabled:opacity-60 border border-green-700/50"
							disabled>Mint Reward</button
						>
					{/if}
				{/if}
			{/if}
		</div>
	</div>
</div>
