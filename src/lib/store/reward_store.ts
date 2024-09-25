import { useStore, type RAW } from './async_store';
import type { Schedulable, RawSchedulable, IdString } from '$lib/type/api';

export type RawReward = IdString &
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
	};

export type Reward = IdString &
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
	};

export function buildReward(data: RAW): Reward {
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
		updatedAt: data.updated_at ? new Date(data.updated_at) : undefined
	};
}

export const rewardStore = useStore<Reward>('/rewards', {}, buildReward);
