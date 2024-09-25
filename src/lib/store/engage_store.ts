import { doFetch } from '$lib/util/fetch';
import { writable } from 'svelte/store';
import { PUBLIC_API_URL } from '$env/static/public';
import { wallet } from './wallet_store';
import type { IdString, RawSchedulable, Schedulable } from '$lib/type/api';
import type { RAW } from './async_store';

export type Engage = IdString &
	Schedulable & {
		campaign_id: string;
		chain_id: number;
		signer_address: string;
		submissions: Record<string, Submission>;
		accepted: Record<string, boolean>;
		messages: Record<string, string>;
		coupon_issue_id?: string;
		coupon_serial?: string;
		coupon_url?: string;
		coupon_expiry?: Date;
		submitted: number;
		approved: number;
		country_id?: number;
		merchant_id?: string;
	};

export type Submission = {
	message?: string;
	link?: string;
	image?: string;
};

export function buildEngage(data: RAW): Engage {
	return {
		id: data.id,
		campaign_id: data.campaign_id,
		chain_id: data.chain_id,
		signer_address: data.signer_address,
		submissions: data.submissions,
		accepted: data.accepted,
		messages: data.messages,
		coupon_issue_id: data.coupon_issue_id,
		coupon_serial: data.coupon_serial,
		coupon_url: data.coupon_url,
		submitted: Object.keys(data.submissions).length,
		approved: Object.values(data.accepted).filter((accepted) => accepted).length,
		createdAt: new Date(data.created_at),
		updatedAt: data.updated_at ? new Date(data.updated_at) : undefined,
		country_id: data.country_id
	};
}

export const engageStore = writable<Record<string, Engage>>({});
wallet.subscribe((s) => {
	const engagements: Record<string, Engage> = {};
	if (s.linked) {
		doFetch(`${PUBLIC_API_URL}/tasks/${s.chainId}/${s.signerAddress}`)
			.then((res) => {
				if (res.ok) {
					res.json<RAW[]>().then((data) => {
						for (const engage of data) {
							engagements[engage.id] = buildEngage(engage);
						}
						engageStore.set(engagements);
					});
				} else {
					res.text().then((text) => console.error(`${res.status}: ${text}`));
				}
			})
			.catch((err) => engageStore.set({}));
	}
});

type RetrieveCouponResponse = {
	coupon_url: string;
};

export async function claimCoupon(campaignId: string, chainId: number, signerAddress: string) {
	const key = `${campaignId}/${chainId}/${signerAddress}`;
	const res = await doFetch(`${PUBLIC_API_URL}/coupons/${chainId}/${signerAddress}/${campaignId}`);
	if (res.ok) {
		const data: RetrieveCouponResponse = await res.json();
		engageStore.update((s) => {
			s[key] = {
				...s[key],
				coupon_url: data.coupon_url
			};
			return s;
		});
		return data.coupon_url;
	}
	console.error(res.status, await res.text());
}
