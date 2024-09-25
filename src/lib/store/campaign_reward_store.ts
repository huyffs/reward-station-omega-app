import { useStore, type RAW } from './async_store';
import type { Schedulable, RawSchedulable, IdString } from '$lib/type/api';

export type RawCampaignReward = IdString &
	RawSchedulable & {
		issuer_id?: string;
		category?: number;
		country_id?: number;
		name: string;
		description: string;
		tandc?: string;
		images: string[];
		active_from?: string;
		active_until?: string;
		valid_from?: string;
		valid_until?: string;
		org_id: string;
		project_id: string;
		campaign_id: string;
		active: boolean;
		point: number;
		max_mint?: number;
		user_mint?: number;
		coupon_minted: number;
		coupon_total: number;
	};

export type CampaignReward = IdString &
	Schedulable & {
		issuer_id?: string;
		category?: number;
		country_id?: number;
		name: string;
		description: string;
		tandc?: string;
		images: string[];
		activeFrom?: Date;
		activeUntil?: Date;
		validFrom?: Date;
		validUntil?: Date;
		org_id: string;
		project_id: string;
		campaign_id: string;
		active: boolean;
		point: number;
		max_mint?: number;
		user_mint?: number;
		coupon_minted: number;
		coupon_total: number;
	};

export function buildReward(data: RAW): CampaignReward {
	return {
		id: data.id,
		issuer_id: data.issuer_id,
		category: data.category,
		country_id: data.country_id,
		name: data.name,
		description: data.description,
		tandc: data.tandc,
		images: data.images,
		activeFrom: data.active_from ? new Date(data.active_from) : undefined,
		activeUntil: data.active_until ? new Date(data.active_until) : undefined,
		validFrom: data.valid_from ? new Date(data.valid_from) : undefined,
		validUntil: data.valid_until ? new Date(data.valid_until) : undefined,
		createdAt: new Date(data.created_at),
		updatedAt: data.updated_at ? new Date(data.updated_at) : undefined,
		org_id: data.org_id,
		project_id: data.project_id,
		campaign_id: data.campaign_id,
		active: data.active,
		point: data.point,
		max_mint: data.max_mint,
		user_mint: data.user_mint,
		coupon_minted: data.coupon_minted,
		coupon_total: data.coupon_total
	};
}

export function useCampaignRewardStore(campaignId: string) {
	return useStore(`/campaign-rewards/${campaignId}`, {}, buildReward);
}
