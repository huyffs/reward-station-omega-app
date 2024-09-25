import { PUBLIC_API_URL } from '$env/static/public';
import { chainId, signerAddress } from 'svelte-wagmi';
import { derived, get } from 'svelte/store';
import { signMessage } from '@wagmi/core';
import { refreshIdToken, userStore } from './user_store';
import { postJSON } from '$lib/util/fetch';

export const wallet = derived(
	[userStore, chainId, signerAddress],
	([$user, $chainId, $signerAddress]) => {
		const walletClaims = ($user?.claims.wallets || {}) as Record<string, boolean>;
		const _signerAddress = $signerAddress?.toLocaleLowerCase();
		const walletId = $chainId && _signerAddress ? `${$chainId}/${_signerAddress}` : undefined;
		return {
			id: walletId,
			user: $user,
			chainId: $chainId,
			signerAddress: _signerAddress,
			linked: walletId ? !!walletClaims[walletId] : false
		};
	}
);

export const walletLinked = derived(wallet, ($wallet) =>
	$wallet.linked ? { chainId: $wallet.chainId!, signerAddress: $wallet.signerAddress! } : undefined
);

export const walletId = derived([chainId, signerAddress], ([$chainId, $signerAddress]) => {
	return $chainId && $signerAddress ? `${$chainId}/${$signerAddress.toLowerCase()}` : undefined;
});

export async function linkWallet() {
	const user_id = get(userStore)?.user.uid;
	const chain_id = get(chainId);
	const signer_address = get(signerAddress);
	if (user_id && chain_id && signer_address) {
		const message = `${user_id}/${chain_id}/${signer_address.toLowerCase()}`;
		const sig = await signMessage({ message });
		const res = await postJSON(`${PUBLIC_API_URL}/auth/link`, {
			sig,
			user_id,
			chain_id,
			signer_address
		});
		if (res.ok) {
			return refreshIdToken();
		} else {
			throw new Error(`${res.status} - Failed to link wallet: ${await res.text()}`);
		}
	} else {
		throw new Error(
			`Not signed in / connected: uid: ${user_id}, chain: ${chain_id}, signer: ${signer_address}`
		);
	}
}
