import { v4 } from "uuid";
import type { SupportedNetworkData } from "../Configs/SupportedNetworks";
import type { WalletCredentials } from "./Web3Service";
import type { WalletData } from "../Schemas/WalletData";

export const newWalletData = (walletName: string, newWallet: WalletCredentials, network: SupportedNetworkData): WalletData | null => {
    if (newWallet.walletAddress != null && newWallet.privateKey != null) {
        let walletListData: WalletData = {
            "id": `${v4()}${v4()}`,
            "name": walletName,
            "blockchainNetworks": [
                {
                    "name": network["name"],
                    "symbol": network["symbol"],
                    "type": network["type"],
                    "decimals": network["decimals"],
                    "amount": 0,
                    "walletAddress": newWallet.walletAddress,
                    "privateKey": newWallet.privateKey, // TODO: Encrypt this...
                    "tokens": []
                }
            ]
        };
        if (newWallet.phrase != null) {
            walletListData["phrase"] = newWallet.phrase; // TODO: Encrypt this...
        }
        if (newWallet.index != null) {
            walletListData["index"] = newWallet.index; // TODO: Encrypt this...
        }

        return walletListData;
    } else {
        return null;
    }
};