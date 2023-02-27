import type { NetworkData } from "./NetworkData";

export interface WalletData {
    "name": string,
    "mnemonic"?: string,
    "index"?: number,
    "blockchainNetworks": NetworkData[]
}