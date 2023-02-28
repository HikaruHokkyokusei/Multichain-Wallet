import Web3 from "web3";
import { ethers } from "ethers";

export interface WalletCredentials {
    walletAddress: string | null,
    privateKey: string | null,
    phrase: string | null | undefined,
    index: number | null
}

export class Web3Service {
    private static _evmWeb3Instances = {
        "eth": new Web3("https://ethereum-mainnet-rpc.allthatnode.com"),
        "bsc": new Web3("https://bsc-dataseed1.binance.org/"),
        "polygon": new Web3("https://polygon-mainnet-rpc.allthatnode.com:8545")
    };

    public static createWallet = async (walletType: "eth" | "bsc" | "polygon"): Promise<WalletCredentials> => {
        if (walletType === "eth" || walletType === "bsc" || walletType === "polygon") {
            let wallet = await ethers.Wallet.createRandom();
            return {
                "walletAddress": wallet.address,
                "privateKey": wallet.privateKey,
                "phrase": wallet.mnemonic?.phrase,
                "index": wallet.index
            };
        } else {
            return {
                "walletAddress": null,
                "privateKey": null,
                "phrase": null,
                "index": null
            };
        }
    };

    /**
     * Function to import wallet from Private Key (importType = 0) or Phrases (importType = 1)
     * @param importType
     * @param importEntity Lower case space seperated phrases or the private key
     * @param walletType
     * @param childIndex
     */
    public static importWallet = (importType: 0 | 1, importEntity: string, walletType: "eth" | "bsc" | "polygon", childIndex?: number): WalletCredentials => {
        if (walletType === "eth" || walletType === "bsc" || walletType === "polygon") {
            if (importType === 0) {
                let wallet = new ethers.Wallet(importEntity);
                return {
                    "walletAddress": wallet.address,
                    "privateKey": wallet.privateKey,
                    "phrase": null,
                    "index": null
                };
            } else if (importType === 1) {
                let wallet = ethers.HDNodeWallet.fromPhrase(importEntity);
                if (childIndex != null) {
                    wallet = wallet.deriveChild(childIndex);
                }
                return {
                    "walletAddress": wallet.address,
                    "privateKey": wallet.privateKey,
                    "phrase": wallet.mnemonic?.phrase,
                    "index": wallet.index
                };
            } else {
                return {
                    "walletAddress": null,
                    "privateKey": null,
                    "phrase": null,
                    "index": null
                };
            }
        } else {
            return {
                "walletAddress": null,
                "privateKey": null,
                "phrase": null,
                "index": null
            };
        }

    };
}