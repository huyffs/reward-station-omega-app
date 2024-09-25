import type { Schedulable, RawSchedulable, Identifiable } from './api';

export type RawCampaign = Identifiable & RawSchedulable & {
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
};

export type Campaign = RawCampaign &
	Schedulable & {
		// export type Campaign = RawCampaign &
		// Schedulable & {
		key?: string;
		startAt: Date;
		endAt?: Date;
	};

export type RawEngage = Identifiable &
	RawSchedulable & {
		campaign_id: string;
		chain_id: number;
		signer_address: string;
		submissions: Record<string, Submission>;
		accepted: Record<string, boolean>;
		messages: Record<string, string>;
		coupon_issue_id?: string;
		coupon_serial?: string;
		coupon_url?: string;
	};

export type Engage = RawEngage &
	Schedulable & {
		submitted: number;
		approved: number;
	};

export type Submission = {
	message?: string;
	link?: string;
	image?: string;
};

export function buildCampaign(data: RawCampaign): Campaign {
	return {
		...data,
		key:
			data.chain_id && data.contract_address
				? `${data.chain_id}/${data.contract_address}`
				: undefined,
		startAt: new Date(data.start_at),
		endAt: data.end_at ? new Date(data.end_at) : undefined,
		createdAt: new Date(data.created_at),
		updatedAt: data.updated_at ? new Date(data.updated_at) : undefined
	};
}

export function buildEngage(data: RawEngage): Engage {
	return {
		...data,
		submitted: Object.keys(data.submissions).length,
		approved: Object.values(data.accepted).filter((accepted) => accepted).length,
		createdAt: new Date(data.created_at),
		updatedAt: data.updated_at ? new Date(data.updated_at) : undefined
	};
}
