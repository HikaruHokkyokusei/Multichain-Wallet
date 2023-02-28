import type { TokenData } from "./TokenData";
import type { SupportedNetworkData } from "../Configs/SupportedNetworks";

export interface NetworkData extends SupportedNetworkData {
    "amount": number,
    "walletAddress": string,
    "privateKey": string,
    "tokens"?: TokenData[]
}