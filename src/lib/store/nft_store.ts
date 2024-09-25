import { Alchemy, Network, NftOrdering, type OwnedNft } from 'alchemy-sdk';
import { PUBLIC_ALCHEMY_API_KEY, PUBLIC_API_URL } from '$env/static/public';
import { chainId, signerAddress } from 'svelte-wagmi';
import { derived, writable } from 'svelte/store';
import { doFetch } from '$lib/util/fetch';

export type AlchemyNetwork = {
	alchemy: Network;
	name: string;
	network: string;
	testnet?: boolean;
};

export const NETWORKS: Record<number, AlchemyNetwork> = {
	1: {
		name: 'Ethereum',
		network: 'Ethereum',
		alchemy: Network.ETH_MAINNET
	},
	5: {
		name: 'Goerli Testnet',
		network: 'Ethereum',
		alchemy: Network.ETH_GOERLI,
		testnet: true
	},
	11155111: {
		name: 'Sepolia Testnet',
		network: 'Ethereum',
		alchemy: Network.ETH_SEPOLIA,
		testnet: true
	},
	16: {
		name: 'Optimism',
		network: 'Optimism',
		alchemy: Network.OPT_MAINNET
	},
	420: {
		name: 'Optimism Goerli Testnet',
		network: 'Optimism',
		alchemy: Network.OPT_GOERLI,
		testnet: true
	},
	42161: {
		name: 'Arbitrum One',
		network: 'Arbitrum',
		alchemy: Network.ARB_MAINNET
	},
	421613: {
		name: 'Arbitrum One Goerli Testnet',
		network: 'Arbitrum',
		alchemy: Network.ARB_GOERLI,
		testnet: true
	},
	137: {
		name: 'Polygon',
		network: 'Polygon',
		alchemy: Network.MATIC_MAINNET
	},
	80001: {
		name: 'Polygon Mumbai Testnet',
		network: 'Polygon',
		alchemy: Network.MATIC_MUMBAI,
		testnet: true
	},
	592: {
		name: 'Astar',
		network: 'Astar',
		alchemy: Network.ASTAR_MAINNET
	},
	1101: {
		name: 'Polygon zkEVM',
		network: 'Polygon',
		alchemy: Network.POLYGONZKEVM_MAINNET
	},
	1422: {
		name: 'Polygon zkEVM Testnet',
		network: 'Polygon',
		alchemy: Network.POLYGONZKEVM_TESTNET,
		testnet: true
	},
	8453: {
		name: 'Base',
		network: 'Base',
		alchemy: Network.BASE_MAINNET
	},
	84531: {
		name: 'Base Goerli Testnet',
		network: 'Base',
		alchemy: Network.BASE_GOERLI,
		testnet: true
	}
};

type MyNFT = OwnedNft & {
	id: string;
};

export type Nft = {
	id: string;
	contract: string;
	symbol: string;
};

type NftResponse = {
	contract: string;
	symbol: string;
};

export const myNfts = derived(
	[chainId, signerAddress],
	async ([$chainId, $signerAddress], set) => {
		if (!$chainId || !$signerAddress) {
			set([]);
			return;
		}
		// const data = readContract({
		// 	address: $signerAddress,
		// 	abi: wagmigotchiABI,
		// 	functionName: 'getHunger',
		// })

		if ($chainId === 592) {
			const res = await doFetch(`${PUBLIC_API_URL}/nft/${$chainId}/${$signerAddress}`);
			if (res.ok) {
				const data: NftResponse[] = await res.json();
				set(
					data.map((n) => {
						const contract = n.contract.toLowerCase();
						return {
							id: `${$chainId}/${contract}`,
							contract,
							symbol: n.symbol
						};
					})
				);
			} else {
				console.error('Failed to get nfts', res.status, await res.text());
			}
		} else {
			const alchemy = new Alchemy({
				apiKey: PUBLIC_ALCHEMY_API_KEY,
				network: NETWORKS[$chainId].alchemy
			});
			alchemy.nft
				.getNftsForOwner($signerAddress, { orderBy: NftOrdering.TRANSFERTIME })
				.then((res) => {
					const nfts: Nft[] = [];
					const keys: string[] = [];
					for (const ownedNft of res.ownedNfts) {
						const contractAddress = ownedNft.contract.address.toLowerCase();
						keys.push(contractAddress);
						nfts.push({
							id: `${$chainId}/${contractAddress}`,
							contract: contractAddress,
							symbol: ownedNft.tokenId
						});
					}
					set(nfts);
				})
				.catch((err) => set([]));
		}
	},
	[] as Nft[]
);
