import type { NetworkData } from "./NetworkData";

export interface WalletData {
    "id": string,
    "name": string,
    "phrase"?: string,
    "index"?: number,
    "blockchainNetworks": NetworkData[]
}