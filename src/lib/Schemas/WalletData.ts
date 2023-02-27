import type { NetworkData } from "./NetworkData";

export interface WalletData {
    "id": string,
    "name": string,
    "mnemonic"?: string,
    "index"?: number,
    "blockchainNetworks": NetworkData[]
}