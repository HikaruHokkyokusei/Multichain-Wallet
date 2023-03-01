import Web3 from "web3";
import { ethers } from "ethers";

export interface WalletCredentials {
    walletAddress: string | null,
    privateKey: string | null,
    phrase: string | null | undefined,
    index: number | null
}
export interface FetchToken {
    walletType: string,
    holderAddress: string,
    isContract: boolean,
    contractAddress?: string
}

export interface FetchedToken {
    "amount": number,
    "networkType": string,
    "contractAddress"?: string
}

export class Web3Service {
    private static _evmWeb3Instances = {
        "eth": new Web3("https://ethereum-mainnet-rpc.allthatnode.com"),
        "bsc": new Web3("https://bsc-dataseed1.binance.org/"),
        "polygon": new Web3("https://polygon-mainnet-rpc.allthatnode.com:8545")
    };
    private static _evmErc20ContractABI: any = [
        {
            "inputs": [],
            "stateMutability": "nonpayable",
            "type": "constructor"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "tokenOwner",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "spender",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "tokens",
                    "type": "uint256"
                }
            ],
            "name": "Approval",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "_from",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "_to",
                    "type": "address"
                }
            ],
            "name": "OwnershipTransferred",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "from",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "to",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "tokens",
                    "type": "uint256"
                }
            ],
            "name": "Transfer",
            "type": "event"
        },
        {
            "inputs": [],
            "name": "acceptOwnership",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "tokenOwner",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "spender",
                    "type": "address"
                }
            ],
            "name": "allowance",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "remaining",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "spender",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "tokens",
                    "type": "uint256"
                }
            ],
            "name": "approve",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "success",
                    "type": "bool"
                }
            ],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "tokenOwner",
                    "type": "address"
                }
            ],
            "name": "balanceOf",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "balance",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "tokens",
                    "type": "uint256"
                }
            ],
            "name": "burn",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "decimals",
            "outputs": [
                {
                    "internalType": "uint8",
                    "name": "",
                    "type": "uint8"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "to",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "tokens",
                    "type": "uint256"
                }
            ],
            "name": "mint",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "name",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "newOwner",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "owner",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "symbol",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "totalSupply",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "to",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "tokens",
                    "type": "uint256"
                }
            ],
            "name": "transfer",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "success",
                    "type": "bool"
                }
            ],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "_from",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "to",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "tokens",
                    "type": "uint256"
                }
            ],
            "name": "transferFrom",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "success",
                    "type": "bool"
                }
            ],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "_newOwner",
                    "type": "address"
                }
            ],
            "name": "transferOwnership",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        }
    ];

    public static createWallet = async (networkType: string): Promise<WalletCredentials> => {
        if (networkType === "eth" || networkType === "bsc" || networkType === "polygon") {
            let wallet = await ethers.Wallet.createRandom();
            return {
                "walletAddress": wallet.address,
                "privateKey": wallet.privateKey,
                "phrase": wallet.mnemonic?.phrase,
                "index": wallet.index
            };
        } else {
            // TODO: Complete this...
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
     * @param networkType
     * @param childIndex
     */
    public static importWallet = (importType: 0 | 1, importEntity: string, networkType: string, childIndex?: number): WalletCredentials => {
        if (networkType === "eth" || networkType === "bsc" || networkType === "polygon") {
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
            // TODO: Complete this...
            return {
                "walletAddress": null,
                "privateKey": null,
                "phrase": null,
                "index": null
            };
        }
    };

    public static getChecksumAddress = (networkType: string, address: string) => {
        if (networkType === "eth" || networkType === "bsc" || networkType === "polygon") {
            if (Web3.utils.isAddress(address)) {
                return Web3.utils.toChecksumAddress(address);
            } else {
                return null;
            }
        } else {
            return null;
        }
    };

    public static getEvmErc20TokenDetails = async (networkType: string, tokenContractAddress: string, holderAddress: string) => {
        try {
            if (networkType === "eth" || networkType === "bsc" || networkType === "polygon") {
                let contract = new this._evmWeb3Instances[networkType].eth.Contract(this._evmErc20ContractABI, tokenContractAddress);
                return {
                    "name": await contract.methods["name"]().call(),
                    "symbol": await contract.methods["symbol"]().call(),
                    "decimals": parseInt(await contract.methods["decimals"]().call()),
                    "amount": parseInt(await contract.methods["balanceOf"](holderAddress).call())
                };
            } else {
                return null;
            }
        } catch (err) {
            console.log(err);
            return null;
        }
    };

    public static getTokenAmounts = async (tokens: FetchToken[]): Promise<FetchedToken[]> => {
        let result: FetchedToken[] = [];

        for (let token of tokens) {
            if (token.walletType === "eth" || token.walletType === "bsc" || token.walletType === "polygon") {
                let appendObject = {
                    "networkType": token.walletType,
                    "contractAddress": token.contractAddress,
                    "amount": 0
                };

                if (token.contractAddress != null) {
                    appendObject["amount"] = parseInt(await (new this._evmWeb3Instances[token.walletType].eth.Contract(
                        this._evmErc20ContractABI,
                        token.contractAddress
                    )).methods["balanceOf"](token.holderAddress).call());
                } else {
                    appendObject["amount"] = parseInt(await this._evmWeb3Instances[token.walletType].eth.getBalance(token.holderAddress));
                }

                result.push(appendObject);
            }
        }

        return result;
    };
}