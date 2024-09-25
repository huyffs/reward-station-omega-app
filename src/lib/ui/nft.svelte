<script lang="ts">
	import { CodeBlock } from '@skeletonlabs/skeleton';
	import type { OwnedNft } from 'alchemy-sdk';

	export let data: OwnedNft;
</script>

<div class="card variant-filled-surface overflow-hidden">
	<header class="card-header">
		<img src={data.media[0].gateway} alt={data.description} />
	</header>
	<section class="p-4">
		<span>
			{data.title}
		</span>
	</section>
	<footer class="card-footer">
		<span>{data.contract.address}</span>
		<a class="anchor" href={data.rawMetadata?.external_url}>{data.rawMetadata?.external_url}</a>
		<!-- <CodeBlock language="json" code={JSON.stringify(data)}></CodeBlock> -->
	</footer>
</div>
