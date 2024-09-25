import { browser } from '$app/environment';
import { PUBLIC_API_URL } from '$env/static/public';
import { derived } from 'svelte/store';
import { useStore, type RAW } from './async_store';
import type { IdSerial } from '$lib/type/api';
import { campaignStore } from './campaign_store';
import { shortAddress } from '$lib/util/web3';

export type EngagementKind = 1 | 2 | 3 | 4;

export type EngagementLogEvent = IdSerial & {
	project_id: string;
	campaign_id: string;
	chain_id: number;
	signer_address: string;
	kind: EngagementKind;
	task_ids?: string[];
	createdAt: Date;
};

export function buildEngagementLogEvent(data: RAW): EngagementLogEvent {
	return {
		id: data.id,
		project_id: data.project_id,
		campaign_id: data.campaign_id,
		chain_id: data.chain_id,
		signer_address: data.signer_address,
		kind: data.kind,
		task_ids: data.task_ids,
		createdAt: new Date(data.created_at)
	};
}

export type EngagementEvent = {
	projectId: string;
	campaignId: string,
	kind: EngagementKind;
	name: string;
	values: string[];
	link: string;
};

export function useEngagementLogStore() {
	return useStore('/events/stream', undefined, buildEngagementLogEvent, (set, update) => {
		if (browser) {
			const eventSource = new EventSource(`${PUBLIC_API_URL}/events/stream`);

			function listener(e: MessageEvent) {
				const item: EngagementLogEvent = JSON.parse(e.data);
				update((s) => {
					s[item.id] = buildEngagementLogEvent(item);
					return s;
				});
			}

			eventSource.addEventListener('message', listener);

			return () => {
				eventSource.removeEventListener('message', listener);
			};
		}
	});
}

export const engagementLogStore = useEngagementLogStore();
export const allEngagementLogs = derived(
	[engagementLogStore, campaignStore],
	([$EngagementLogStore, $campaignStore]) => {
		const allLogs = Object.values($EngagementLogStore).sort(
			(a, b) => b.createdAt.getTime() - a.createdAt.getTime()
		);
		const events: EngagementEvent[] = [];
		for (const ev of allLogs) {
			const name = shortAddress(ev.signer_address);
			switch (ev.kind) {
				case 1:
				case 2:
					if (ev.task_ids?.length) {
						if (Object.hasOwn($campaignStore, ev.campaign_id)) {
							const tasks = $campaignStore[ev.campaign_id].tasks.filter((t) =>
								ev.task_ids!.includes(t.id)
							);
							for (const task of tasks) {
								events.push({
									projectId: ev.project_id,
									campaignId: ev.campaign_id,
									kind: ev.kind,
									name,
									values: [task.name],
									link: 'https://sepolia.etherscan.io/address/' + ev.signer_address
								});
							}
						}
					}
					break;
				case 3:
				case 4:
					events.push({
						projectId: ev.project_id,
						campaignId: ev.campaign_id,
						kind: ev.kind,
						name,
						values: [$campaignStore[ev.campaign_id]?.reward_info || ' a coupon'],
						link: 'https://sepolia.etherscan.io/address/' + ev.signer_address
					});
					break;
			}
		}
		return events;
	}
);
