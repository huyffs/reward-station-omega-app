import { derived } from 'svelte/store';
import { myNfts, type Nft } from './nft_store';
import { allCampaigns, type Campaign } from './campaign_store';

export type CampaignWithNfts = Campaign & {
	nfts: Nft[];
};

export const campaignWithNfts = derived(
	[myNfts, allCampaigns],
	([$myNfts, $allCampaigns], set) => {
		const items: CampaignWithNfts[] = [];
		for (const campaign of $allCampaigns) {
			const nfts: Nft[] = [];
			for (const nft of $myNfts) {
				if (nft.contract === campaign.contract_address) {
					nfts.push(nft);
				}
			}
			items.push({
				...campaign,
				nfts
			});
		}
		set(items);
	},
	[] as CampaignWithNfts[]
);
