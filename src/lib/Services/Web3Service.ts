import Web3 from "web3";
import { ethers } from "ethers";

export class Web3Service {
    private static _evmWeb3Instances = {
        "eth": new Web3("https://ethereum-mainnet-rpc.allthatnode.com"),
        "bsc": new Web3("https://bsc-dataseed1.binance.org/"),
        "polygon": new Web3("https://polygon-mainnet-rpc.allthatnode.com:8545")
    };

    public static createWallet = async (walletType: "eth" | "bsc" | "polygon") => {
        if (walletType === "eth" || walletType === "bsc" || walletType === "polygon") {
            let wallet = await ethers.Wallet.createRandom();
            return {
                "publicKey": wallet.publicKey,
                "privateKey": wallet.privateKey,
                "mnemonic": wallet.mnemonic?.phrase,
                "index": wallet.index
            };
        }
    };

    public static getWalletFromMnemonics = (mnemonics: string) => {
        let wallet = ""
    };
}