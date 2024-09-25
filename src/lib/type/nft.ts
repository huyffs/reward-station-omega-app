import type { OwnedNft } from "alchemy-sdk";
import type { Campaign } from "./campaign";

export type NFTContract = {
  nfts: Record<string, OwnedNft>;
  campaign?: Campaign;
};