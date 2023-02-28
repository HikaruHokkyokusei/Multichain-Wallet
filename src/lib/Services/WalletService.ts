import { v4 } from "uuid";
import type { SupportedNetworkData } from "../Configs/SupportedNetworks";
import type { WalletCredentials } from "./Web3Service";
import type { WalletData } from "../Schemas/WalletData";
import type { NetworkData } from "../Schemas/NetworkData";

export class WalletService {
    public static newWalletData = (walletName: string, newWallet: WalletCredentials, network: SupportedNetworkData) => {
        let walletData: WalletData | null = null;
        let networkDataList: NetworkData[] | null = null;

        if (newWallet.walletAddress != null && newWallet.privateKey != null) {
            walletData = {
                "id": `${v4()}${v4()}`,
                "name": walletName
            };
            if (newWallet.phrase != null) {
                walletData["phrase"] = newWallet.phrase; // TODO: Encrypt this...
            }
            if (newWallet.index != null) {
                walletData["index"] = newWallet.index; // TODO: Encrypt this...
            }

            networkDataList = [
                {
                    "name": network["name"],
                    "symbol": network["symbol"],
                    "type": network["type"],
                    "decimals": network["decimals"],
                    "amount": 0,
                    "walletAddress": newWallet.walletAddress,
                    "privateKey": newWallet.privateKey, // TODO: Encrypt this...
                }
            ];
        }

        return {
            walletData,
            networkDataList
        };
    };
}
