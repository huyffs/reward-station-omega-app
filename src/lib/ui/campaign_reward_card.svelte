<script lang="ts">
	import { PUBLIC_API_URL } from '$env/static/public';
	import { couponStore, type Coupon } from '$lib/store/coupon_store';
	import type { CampaignReward } from '$lib/store/campaign_reward_store';
	import type { Reward } from '$lib/store/reward_store';
	import { walletLinked } from '$lib/store/wallet_store';
	import { doFetch } from '$lib/util/fetch';
	import { getToastStore } from '@skeletonlabs/skeleton';
	import {
		campaignnParticipationStore,
		type CampaignParticipation
	} from '$lib/store/campaign_participation_store';
	import { voucherStore } from '$lib/store/voucher_store';
	import type { RAW } from '$lib/store/async_store';
	import { invalidateAll } from '$app/navigation';

	export let reward: Reward;
	export let campaignReward: CampaignReward | undefined = undefined;
	export let coupon: Coupon | undefined = undefined;
	export let campaignnParticipation: CampaignParticipation | undefined = undefined;
	let clazz: string = '';
	export { clazz as class };

	const toastStore = getToastStore();

	async function mint() {
		if (!campaignReward) {
			return;
		}
		const campaignId = campaignReward.campaign_id;
		const res = await doFetch(`${PUBLIC_API_URL}/campaign-rewards/${campaignId}/${reward.id}`, {
			method: 'POST'
		});
		if (res.ok) {
			const data: { coupon: RAW; vouchers: RAW[]; balance: number } = await res.json();
			couponStore.insertRaw(data.coupon);
			voucherStore.insertAllRaw(data.vouchers);
			campaignnParticipationStore.update((s) => {
				const item = s[campaignId];
				s[campaignId] = {
					...item,
					balance: data.balance
				};
				return s;
			});
			toastStore.trigger({
				message: 'Minted successfully!',
				background: 'variant-filled-success'
			});
			return invalidateAll();
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
	const supply = campaignReward?.coupon_total ?? 0;
	const max = campaignReward?.max_mint ?? 0;
	const minted = campaignReward?.coupon_minted ?? 0;
	const total = max > supply ? supply : max;
	const available = total - minted;
	const mintable = max < available ? max : available;
	console.log(mintable);
</script>

<div
	class="rounded-3xl h-max lg:h-56 bg-white/[0.02] border border-white/5 p-2 overflow-hidden w-full flex flex-col lg:flex-row gap-4 {clazz}"
>
	<header class="h-full aspect-square rounded-2xl overflow-hidden">
		<img src={img} alt={reward.name} class="w-full h-full object-cover" />
	</header>
	<div class="p-4 pt-0 lg:pt-4 flex-grow">
		<h2 class="text-2xl fonra mb-0 lg:mb-4">{reward.name}</h2>
		<dl class="flex flex-col lg:flex-row gap-1 w-full justify-between border-b border-white/5 py-2 mb-6">
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
			<div class="flex gap-2 items-center">
				<dt class="text-surface-300">Availability:</dt>
				<dd class="block rounded-xl bg-white/5 text-white/80 px-3 py-0.5">
					{mintable}
				</dd>
			</div>
		</dl>
		<div class="mt-4 flex gap-2">
			{#if coupon}
				<a href={coupon.url} class="btn">Redeem</a>
			{:else if campaignReward}
				<span
					class="bg-white/5 px-3 py-1.5 items-center flex border border-white/10 text-white/70 rounded-xl"
					>{campaignReward.point} points</span
				>
				{#if !available}
				<span
					class="bg-white/5 px-3 py-1.5 items-center flex border border-white/10 text-white/70 rounded-xl"
					>Fully Minted</span
				>
				{:else if $walletLinked}
					{#if campaignnParticipation?.point && campaignnParticipation.balance >= campaignReward.point}
						<button class="px-4 py-1.5 items-center flex rounded-xl bg-green-900/50 text-white/80 disabled:opacity-60 border border-green-700/50" on:click={mint}
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