import type { IdString } from '$lib/type/api';
import { useStore, type RAW } from './async_store';

export type CampaignParticipation = IdString & {
	balance: number;
	point: number;
};

export function buildCampaignParticipation(data: RAW): CampaignParticipation {
	return {
		id: data.campaign_id,
		balance: data.balance,
		point: data.point
	};
}

export const campaignnParticipationStore = useStore(
	`/campaign-participations`,
	{},
	buildCampaignParticipation
);
