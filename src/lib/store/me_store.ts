import { writable } from 'svelte/store';
import { doFetch } from '$lib/util/fetch';
import { PUBLIC_API_URL } from '$env/static/public';

export type Me = {
	xp: number;
	club: number;
};

export const meStore = writable<Me | undefined>();

export async function fetchMe() {
	const res = await doFetch(`${PUBLIC_API_URL}/me`);
	if (res.ok) {
		const data: Me = await res.json();
		meStore.set(data);
	} else {
		console.error(await res.text());
	}
}
