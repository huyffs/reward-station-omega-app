<script lang="ts">
	import type { EngagementEvent, EngagementKind } from '$lib/store/engagement_log_store';
	import Marqueeck from '@arisbh/marqueeck';

	export let events: EngagementEvent[];

	const emojiMap: Record<EngagementKind, string> = {
		1: '💪',
		2: '✅',
		3: '🎁',
		4: '💰'
	};

	const messageMap: Record<EngagementKind, string> = {
		1: 'Task completed',
		2: 'Task approved',
		3: 'Reward received',
		4: 'Reward claimed'
	};
</script>

<Marqueeck options={{ padding: { x: 0, y: 0 } }}>
	<div class="flex gap-2">
		{#each events as ev}
			<a href="/clubs/{ev.projectId}#campaign-{ev.campaignId}" class="card card-hover">
				<header class="card-header">
					<span>{emojiMap[ev.kind]}</span>
					<span>{ev.values[0]}</span>
				</header>
				<content class="p-4">
					<span>{messageMap[ev.kind]}</span>
				</content>
				<footer class="card-footer">
					<a href={ev.link} target="_blank" class="anchor">{ev.name}</a>
				</footer>
			</a>
		{/each}
	</div>
</Marqueeck>
