<script lang="ts">
	import { allCoupons, couponStore, type Coupon } from '$lib/store/coupon_store';
	import { meStore } from '$lib/store/me_store';
	import { rewardStore, type Reward } from '$lib/store/reward_store';
	import { userStore } from '$lib/store/user_store';
	import ProjectRewardCard from '$lib/ui/project_reward_card.svelte';
	import { Avatar } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';
	import { derived } from 'svelte/store';
	import { walletLinked } from '$lib/store/wallet_store';

	type Redeemed = {
		reward: Reward;
		coupon: Coupon;
	};

	const coupons = derived([rewardStore, allCoupons], ([$rewardStore, $allCoupons]) => {
		const c: Redeemed[] = [];
		if ($rewardStore) {
			for (const coupon of $allCoupons) {
				const reward = $rewardStore[coupon.reward_id];
				if (reward) {
					c.push({
						reward,
						coupon
					});
				}
			}
		}
		return c;
	});

	onMount(() => {
		couponStore.fetchAll();
		rewardStore.fetchAll();
	});
</script>

<section class="max-w-screen-xl mx-auto px-4 mt-4 mb-20">
	<div
		class="w-screen mix-blend-luminosity bg-[url(/assets/polka.png)] absolute top-2 left-0 h-3/5 max-h-[600px] -z-10"
	></div>
	<div class="w-full max-w-screen-lg mx-auto gap-6 flex items-center justify-center mt-12">
		<h2 class="text-2xl lg:text-3xl font-raleway mt-8 mb-4">Your Rewards</h2>
		<div class="flex-grow h-0 border-y rounded-full mt-3 border-white/20"></div>
	</div>
	{#if $walletLinked}<div
			class="max-w-screen-lg p-6 bg-[#131318] rounded-[32px] border border-white/5 shadow-2xl mx-auto px-4"
		>
			<div
				class="flex flex-col md:flex-row lg:pt-10 justify-center h-max pb-4 px-2 border-b-2 border-white/5 gap-12"
			>
				<div
					class="h-40 hidden md:block aspect-square bg-gradient-to-br from-white/[0.02] to-white/5 border border-white/15 rounded-full p-2"
				>
					<Avatar
						src={$userStore?.user.photoURL || undefined}
						initials={$userStore?.user.displayName?.substring(0, 2)}
						width="500"
						background="bg-tertiary-900"
					/>
				</div>
				<div class="w-max">
					<div class="text-2xl font-raleway text-white flex gap-2">
						<h2 class="text-2xl font-raleway">{$userStore?.user.displayName || 'User'}'s</h2>
						<h4 class="opacity-40 text-2xl font-raleway">MetaLoyalty Profile</h4>
					</div>
					<div class="flex gap-2 my-2 mt-4">
						<div
							class="flex gap-2 text-green-400 px-4 py-1 bg-green-900/20 font-medium border border-green-700/60 rounded-full w-max"
						>
							<span>{$meStore?.xp ?? 0}</span>
							<span>RewardStationOmega XP</span>
						</div>
						<div
							class="flex gap-2 text-yellow-300 px-4 py-1 bg-yellow-600/10 font-medium border border-yellow-400/40 rounded-full w-max"
						>
							Gold Tier
						</div>
					</div>
					<div
						class="w-max border border-white/20 lg:divide-x-2 divide-y-2 lg:divide-y-0 mt-4 lg:mt-2 divide-white/20 flex flex-col md:flex-row rounded-2xl"
					>
						<div class="flex gap-2 px-5 py-1 font-medium text-white">
							<span class="opacity-50 font-normal">Total $DOMO earned:</span>
							<span class="opacity-85">0</span>
						</div>
						<div class="flex gap-2 px-5 py-1 font-medium text-white">
							<span class="opacity-50 font-normal">$DOMO available:</span>
							<span class="opacity-85">0</span>
						</div>
					</div>
					<div class="lg:flex grid grid-cols-2 flex-row gap-2 mt-4 border-t border-white/5 py-4">
						<div class="flex-col flex bg-black/10 px-5 w-max py-3 rounded-xl">
							<dt class="text-white opacity-50 font-raleway text-l">Main Country:</dt>
							<dd class="text-xl text-white/75 font-medium tracking-wide">Japan</dd>
						</div>
						<div class="flex-col flex bg-black/10 px-5 w-max py-3 rounded-xl">
							<dt class="text-white opacity-50 font-raleway text-l">Total Clubs:</dt>
							<dd class="text-xl text-white/75 font-medium tracking-wide">
								{$meStore?.club ?? '--'}
							</dd>
						</div>
						<div class="flex-col flex bg-black/10 px-5 w-max py-3 rounded-xl">
							<dt class="text-white opacity-50 font-raleway text-l">Decay Wastage Rate:</dt>
							<dd class="text-xl text-white/75 font-medium tracking-wide">0</dd>
						</div>
					</div>
				</div>
			</div>
			<div class="w-full bg-black/20 p-6 mt-6 rounded-xl">
				<div class="text-xl w-full pb-3 border-b border-white/10 text-white/80 mb-6">
					Rewards Wallet
				</div>
				{#if $coupons.length}
					<div class="grid md:grid-cols-2 gap-4">
						{#each $coupons as coupon}
							<ProjectRewardCard reward={coupon.reward} coupon={coupon.coupon} />
						{/each}
					</div>
				{:else}
					<div class="text-white/30 mb-20 font-raleway text-2xl">No Rewards Yet!</div>
				{/if}
			</div>
		</div>
	{:else}
		<header
			class="rounded-3xl flex flex-col items-center gap-12 mt-4 mb-20 bg-[#18181f] lg:bg-[#101015] to-90% px-8 py-10 lg:p-24 text-center"
		>
			<div class="flex flex-col gap-2">
				<span class="block text-2xl lg:text-3xl font-medium text-white/60"
					>Whoops! Seems like you aren't logged in</span
				>
				<span class="block text-lg text-white/40">You must be logged in to view your rewards.</span>
			</div>
			<a
				href="/me?mode=sign_in"
				class="bg-gradient-to-r w-max outline outline-offset-2 outline-transparent hover:outline-purple-300/10 duration-300 from-[#454f8c] to-[#6c427f] py-2 px-6 text-xl rounded-full font-raleway font-medium"
				>Proceed to Login</a
			>
		</header>
	{/if}
</section>
