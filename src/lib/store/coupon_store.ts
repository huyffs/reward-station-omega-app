import type { IdString, Schedulable } from '$lib/type/api';
import { derived } from 'svelte/store';
import { useStore, type RAW, parseDate } from './async_store';

export type Coupon = IdString &
	Schedulable & {
		reward_id: string;
		number: number;
		url: string;
		user_id?: string;
		mintedAt?: Date;
	};

export function buildCoupon(data: RAW): Coupon {
	return {
    id: `${data.reward_id}/${data.number}`,
    reward_id: data.reward_id,
    number: data.number,
    url: data.url,
    user_id: data.user_id,
    mintedAt: parseDate(data.minted_at),
    createdAt: new Date(data.created_at),
    updatedAt: parseDate(data.updated_at),
};
}

export const couponStore = useStore<Coupon>('/coupons', {}, buildCoupon);

export const allCoupons = derived(couponStore, ($couponStore) => {
	return Object.values($couponStore).sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
});
