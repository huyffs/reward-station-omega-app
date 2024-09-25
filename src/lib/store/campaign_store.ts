import { derived } from 'svelte/store';
import { useStore, type RAW } from './async_store';
import type { Schedulable, RawSchedulable, Identifiable, IdString } from '$lib/type/api';

export type RawCampaign = IdString &
	RawSchedulable & {
		org_id: string;
		project_id: string;
		name: string;
		description: string;
		budget: number;
		logo?: string;
		start_at: string;
		end_at?: string;
		chain_id?: number;
		contract_address?: string;
		condition_info: string;
		reward_amount: number;
		reward_info: string;
		tasks: Task[];
		images: string[];
	};

export type Task = {
	id: string;
	name: string;
	description: string;
	link: string;
	images: string[];
	point: number;
};

export type Campaign = IdString &
	Schedulable & {
		org_id: string;
		project_id: string;
		name: string;
		description: string;
		budget: number;
		logo?: string;
		start_at: string;
		end_at?: string;
		chain_id?: number;
		contract_address?: string;
		condition_info: string;
		reward_amount: number;
		reward_info: string;
		tasks: Task[];
		images: string[];
		key?: string;
		startAt: Date;
		endAt?: Date;
	};

export function buildCampaign(data: RAW): Campaign {
	const contract_address = data.contract_address?.toLowerCase();
	return {
		id: data.id,
		org_id: data.org_id,
		project_id: data.project_id,
		name: data.name,
		description: data.description,
		budget: data.budget,
		logo: data.logo,
		start_at: data.start_at,
		end_at: data.end_at,
		chain_id: data.chain_id,
		contract_address,
		condition_info: data.condition_info,
		reward_amount: data.reward_amount,
		reward_info: data.reward_info,
		tasks: data.tasks,
		images: data.images,
		key: data.chain_id && contract_address ? `${data.chain_id}/${contract_address}` : undefined,
		startAt: new Date(data.start_at),
		endAt: data.end_at ? new Date(data.end_at) : undefined,
		createdAt: new Date(data.created_at),
		updatedAt: data.updated_at ? new Date(data.updated_at) : undefined
	};
}

export function useCampaignStore() {
	return useStore<Campaign>('/engage', {}, buildCampaign);
}

export const campaignStore = useCampaignStore();

export const campaignsByContractAddr = derived(campaignStore, ($campaignStore) => {
	const campaigns: Record<string, Campaign[]> = {};
	for (const campaign of Object.values($campaignStore)) {
		if (campaign.contract_address) {
			if (campaigns[campaign.contract_address]) {
				campaigns[campaign.contract_address].push(campaign);
			} else {
				campaigns[campaign.contract_address] = [campaign];
			}
		}
	}
	for (const contract of Object.values(campaigns)) {
		contract.sort((a, b) => a.createdAt.getDate() - b.createdAt.getDate());
	}
	return campaigns;
});

export const allCampaigns = derived(campaignStore, ($campaignStore) => {
	return Object.values($campaignStore).sort(
		(a, b) => b.createdAt.getTime() - a.createdAt.getTime()
	);
});
