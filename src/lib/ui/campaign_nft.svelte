<script lang="ts" context="module">
	export type CampaignOwnedNft = OwnedNft & {
		campaignId: string;
	};
</script>

<script lang="ts">
	import type { OwnedNft } from 'alchemy-sdk';

	export let data: CampaignOwnedNft;
</script>

<div class="card variant-filled-surface overflow-hidden">
	<header class="card-header relative inline-block">
		<aside class="absolute inline-block animate-bounce">
			<span class="text-6xl">🌟</span>
			<span class="text-2xl inline-block animate-bounce">Earn rewards!</span>
		</aside>
		<img src={data.media[0].gateway} alt={data.description} />
	</header>
	<section class="p-4">
		<span>
			{data.title}
		</span>
	</section>
	<footer class="card-footer">
		<a href="/campaigns/{data.campaignId}" class="anchor">
			<span>This NFT is eligible for rewards, claim now!</span>
		</a>
	</footer>
</div>
