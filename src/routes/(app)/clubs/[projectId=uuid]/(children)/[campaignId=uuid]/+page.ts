import { PUBLIC_API_URL } from '$env/static/public';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import type { RAW } from '$lib/store/async_store';

export const load: PageLoad = async ({ fetch, params }) => {
	return Promise.all([
		fetch(`${PUBLIC_API_URL}/engage/${params.campaignId}`).then((res) => {
			if (res.ok) {
				return res.json<RAW>();
			}
			return res.text().then((err) => {
				throw Error(`${res.status} ${err}`);
			});
		}),
		fetch(`${PUBLIC_API_URL}/campaign-rewards/${params.campaignId}`).then((res) => {
			if (res.ok) {
				return res.json<RAW[]>();
			}
			return res.text().then((err) => {
				throw Error(`${res.status} ${err}`);
			});
		})
	])
		.then(([campaign, rewards]) => ({ campaign, rewards }))
		.catch((err) => {
			error(500, {
				message: err.toString()
			});
		});
};
