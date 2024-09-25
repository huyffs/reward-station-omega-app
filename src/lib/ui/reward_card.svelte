<script lang="ts">
	import merchants from '$lib/const/merchants';
	import type { Engage } from '$lib/store/engage_store';
	import { claimCoupon } from '$lib/store/engage_store';

	export let en: Engage;
	let clazz: string = '';
	export { clazz as class };
</script>

<div class="card rounded-3xl overflow-hidden h-full flex flex-row gap-4 {clazz}">
	<header class="basis-1/3">
		<img
			src="/merchants/{en.merchant_id ?? '_default'}.jpg"
			alt="merchant"
			class="w-full h-full object-cover"
		/>
	</header>
	<div class="p-4 basis-2/3">
		<h2 class="h4 mb-4">{merchants[en.merchant_id ?? ''].name}</h2>
		<dl class="flex flex-wrap">
			<div class="basis-1/2 my-1">
				<dt class="text-xs text-surface-300">Country</dt>
				<dd>{en.country_id}</dd>
			</div>
			<div class="basis-1/2 my-1">
				<dt class="text-xs text-surface-300">Redeem</dt>
				<dd>TODO</dd>
			</div>
			<div class="basis-1/2 my-1">
				<dt class="text-xs text-surface-300">Expiry</dt>
				<dd>TODO</dd>
			</div>
		</dl>
		<div class="mt-4 text-center">
			{#if en.coupon_url}
				<a
					href={en.coupon_url}
					target="_blank"
					class="btn variant-ghost-primary hover:variant-filled-primary">Retrieve</a
				>
			{:else}
				<button
					class="btn variant-ghost-primary hover:variant-filled-primary"
					on:click={() => claimCoupon(en.campaign_id, en.chain_id, en.signer_address)}
					>Redeem</button
				>{/if}
		</div>
	</div>
</div>
