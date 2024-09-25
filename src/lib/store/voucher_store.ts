import type { IdString, Schedulable } from '$lib/type/api';
import { derived } from 'svelte/store';
import { useStore, type RAW, parseDate } from './async_store';

export type Voucher = IdString &
	Schedulable & {
		org_id?: string;
		project_id: string;
		campaign_id: string;
		chain_id: number;
		signer_address: String;
		user_id: String;
		task_id: String;
		value: number;
		balance: number;
		validFrom?: Date;
		validUntil?: Date;
	};

export function buildVoucher(data: RAW): Voucher {
	return {
		id: `${data.campaign_id}/${data.chain_id}/${data.signer_address}/${data.task_id}`,
		org_id: data.org_id,
		project_id: data.project_id,
		campaign_id: data.campaign_id,
		chain_id: data.chain_id,
		signer_address: data.signer_address,
		user_id: data.user_id,
		task_id: data.task_id,
		value: data.value,
		balance: data.balance,
		validFrom: parseDate(data.valid_from),
		validUntil: parseDate(data.valid_until),
		createdAt: new Date(data.created_at),
		updatedAt: parseDate(data.updated_at)
	};
}

export const voucherStore = useStore<Voucher>('/vouchers', {}, buildVoucher);

export const allVouchers = derived(voucherStore, ($voucherStore) => {
	return Object.values($voucherStore).sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
});
