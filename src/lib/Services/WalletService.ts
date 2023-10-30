import { v4 } from "uuid";
import type { SupportedNetworkData } from "../Configs/SupportedNetworks";
import type { WalletCredentials } from "./Web3Service";
import type { WalletData } from "../Schemas/WalletData";
import type { NetworkData } from "../Schemas/NetworkData";

export class WalletService {
    public static newWalletData = (
        walletName: string, newWallet: WalletCredentials, network: SupportedNetworkData,
        encryptedPhrases: string | null, phrasesIv: string | null,
        encryptedIndex: string | null, indexIv: string | null,
        encryptedPrivateKey: string | null, privateKeyIv: string | null
    ) => {
        let walletData: WalletData | null = null;
        let networkDataList: { [networkType: string]: NetworkData } | null = null;

        if (newWallet.walletAddress != null && newWallet.privateKey != null) {
            walletData = {
                "id": `${v4()}${v4()}`,
                "name": walletName
            };
            if (encryptedPhrases != null && phrasesIv != null) {
                walletData["phrase"] = encryptedPhrases;
                walletData["phraseIv"] = phrasesIv;
            }
            if (encryptedIndex != null && indexIv != null) {
                walletData["index"] = encryptedIndex;
                walletData["indexIv"] = indexIv;
            }

            networkDataList = {};
            if (encryptedPrivateKey != null && privateKeyIv != null) {
                networkDataList[network["type"]] = {
                    "name": network["name"],
                    "symbol": network["symbol"],
                    "type": network["type"],
                    "decimals": network["decimals"],
                    "amount": 0,
                    "walletAddress": newWallet.walletAddress,
                    "privateKey": encryptedPrivateKey,
                    "privateKeyIv": privateKeyIv
                };
            }
        }

        return {
            walletData,
            networkDataList
        };
    };
}
