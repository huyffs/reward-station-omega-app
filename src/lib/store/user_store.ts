import { PUBLIC_API_URL } from '$env/static/public';
import { auth } from '$lib/firebase';
import { doFetch } from '$lib/util/fetch';
import type { User } from 'firebase/auth';
import { writable } from 'svelte/store';
import { meStore } from './me_store';

export type UserStore = {
	user: User;
	claims: CustomClaims;
};

export type CustomClaims = {
	orgs: Record<string, number>;
	wallets: Record<string, boolean>;
};

export const userStore = writable<UserStore | undefined>(undefined);

export async function setUser(u: User | null, forceRefresh: boolean | undefined = undefined) {
	if (!u) {
		userStore.set(undefined);
		meStore.set(undefined);
		return;
	}
	const idResult = await u.getIdTokenResult(forceRefresh);
	const walletClaims = idResult.claims.w as Record<string, boolean>;
	const wallets: Record<string, boolean> = {};
	let permissionNeedsFixing = false;
	for (const k in walletClaims) {
		wallets[k] = walletClaims[k];
		if (!permissionNeedsFixing && k !== k.toLowerCase()) {
			permissionNeedsFixing = true;
		}
	}
	if (permissionNeedsFixing) {
		doFetch(`${PUBLIC_API_URL}/auth/fix`).then((res) => {
			if (res.ok) {
				console.log('Permissions fixed');
			} else {
				res.text().then((msg) => console.error('error fix permission', msg));
			}
		});
	}
	userStore.set({
		user: u,
		claims: {
			orgs: idResult.claims.a as Record<string, number>,
			wallets
		}
	});
}

auth.authStateReady().then(() => setUser(auth.currentUser));
auth.onAuthStateChanged((user) => setUser(user));
auth.onIdTokenChanged((user) => setUser(user));

export async function refreshIdToken() {
	return setUser(auth.currentUser, true);
}
