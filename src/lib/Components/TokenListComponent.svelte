<script lang="ts">
    import { genericDataStore } from "../Stores/GenericDataStore";
    import { walletListStore } from "../Stores/WalletListStore";
    import type { NetworkCollection } from "../Stores/NetworkCollectionStore";
    import { networkCollectionStore } from "../Stores/NetworkCollectionStore";
    import { tokenListStore } from "../Stores/TokenListStore";
    import type { FetchToken } from "../Services/Web3Service";
    import { Web3Service } from "../Services/Web3Service";
    import type { NetworkData } from "../Schemas/NetworkData";
    import type { TokenData } from "../Schemas/TokenData";

    let showMenu = false;
    let addNewToken = () => {
        if (networkData) {
            $genericDataStore = {
                ...$genericDataStore,
                "showPopup": true,
                "popupType": "importEvmErc20Token",
                "popupParams": {
                    "walletId": $walletListStore[$genericDataStore["selectedWalletIndex"]].id,
                    "existingTokens": tokens || {},
                    "holderAddress": networkData.walletAddress,
                    "networkType": networkData.type
                }
            };
        }
        showMenu = false;
    };

    let walletAddress: string;
    let networkData: NetworkData | null;
    let tokens: { [contractAddress: string]: TokenData };

    $: {
        if ($genericDataStore["selectedNetworkType"] != null) {
            if ($networkCollectionStore[$walletListStore[$genericDataStore["selectedWalletIndex"]].id]) {
                networkData = $networkCollectionStore[$walletListStore[$genericDataStore["selectedWalletIndex"]].id][$genericDataStore["selectedNetworkType"]];
            } else {
                networkData = null;
            }
        } else {
            networkData = null;
        }
    }
    $: {
        if (networkData) {
            walletAddress = networkData.walletAddress;
        }
    }
    $: {
        if (networkData && $tokenListStore) {
            tokens = $tokenListStore
        } else {
            tokens = {};
        }
    }

    let updateAmounts = async () => {
        // TODO: Check for race conditions...
        if (networkData) {
            let selectedWalletId = $walletListStore[$genericDataStore["selectedWalletIndex"]].id;
            let selectedNetworkType = networkData.type;

            let fetchList: FetchToken[] = [
                { walletType: networkData.type, holderAddress: networkData.walletAddress, isContract: false }
            ];

            if (tokens) {
                for (let key of Object.keys(tokens)) {
                    fetchList.push({
                        walletType: networkData.type,
                        holderAddress: networkData.walletAddress,
                        isContract: true,
                        contractAddress: key
                    });
                }
            }

            let fetchedTokens = await Web3Service.getTokenAmounts(fetchList);
            let networkCollection: NetworkCollection = {
                ...$networkCollectionStore
            }

            let currNetworkData: NetworkData = networkCollection[selectedWalletId][selectedNetworkType];
            currNetworkData["amount"] = fetchedTokens[0]["amount"];
            $networkCollectionStore = networkCollection;
            window.electronAPI.writeToFile(
                `${$genericDataStore["userDataPath"]}\\wallets\\` +
                `${selectedWalletId}\\networkDataList.json`,
                JSON.stringify($networkCollectionStore[selectedWalletId])
            ).then();

            // TODO: Make checks before implementing this logic...
            fetchedTokens.shift()
            let allTokens = { ...$tokenListStore }
            for (let token of fetchedTokens) {
                allTokens[token.contractAddress]["amount"] = token.amount;
            }
            $tokenListStore = allTokens;
            window.electronAPI.writeToFile(
                `${$genericDataStore["userDataPath"]}\\wallets\\` +
                `${selectedWalletId}\\${selectedNetworkType}\\tokenDataList.json`,
                JSON.stringify($tokenListStore)
            ).then();
        }
    };

    let copyAddress = async () => {
        if (walletAddress !== "Copied") {
            await window.electronAPI.copyToClipboard(walletAddress);

            walletAddress = "Copied";
            setTimeout(() => {
                if (networkData) {
                    walletAddress = networkData["walletAddress"];
                }
            }, 1000);
        }
    };
</script>

<div class="CenterColumnFlex Wrapper" style="background-color: #4c4c65; justify-content: flex-start">
    {#if networkData != null}
        <div style="height: 25px;"></div>

        <div class="TokenListMainCoin" style="min-height: 150px; height: 150px; background-color: #6B728E;">
            <div style="height: 5px; width: 100%;"></div>

            <div class="CenterRowFlex WalletAddressHolder" style="justify-content: flex-end; text-align: right;">
                <i on:click={updateAmounts} class="fa-solid fa-arrows-rotate"
                   style="font-size: 18px; cursor: pointer;"></i>
                <div style="width: 10px;"></div>
                <div on:click={() => {showMenu = !showMenu;}} style="width: 15px; text-align: center;">
                    <i class="fa-solid fa-ellipsis-vertical" style="font-size: 18px; cursor: pointer;"></i>
                </div>
                <div style="width: 5px;"></div>
                {#if showMenu}
                    <div class="CenterColumnFlex OptionsMenu">
                        <div on:click={addNewToken} style="width: 100%; cursor:pointer;">Add New Token</div>
                        <div style="width: 100%; cursor:pointer;">Show Private Key</div>
                    </div>
                {/if}
            </div>

            <div class="CenterColumnFlex" style="width: 100%; flex: 4 0 0;">
                <div style="font-size: 45px; font-weight: bold;">
                    {(networkData["amount"] / (10 ** networkData["decimals"])).toFixed(3)}
                </div>
                <div style="font-size: 30px; font-weight: bold; cursor: pointer;">{networkData["symbol"]}</div>
            </div>

            <div class="CenterRowFlex WalletAddressHolder">
                {#if walletAddress === "Copied"}
                    {walletAddress}
                {:else}
                    {walletAddress.substring(0, 10)}......{walletAddress.substring(walletAddress.length - 9)}
                    <div style="width: 15px;"></div>
                    <i on:click={copyAddress} class="fa-regular fa-clipboard"
                       style="font-size: 18px; cursor:pointer;"></i>
                {/if}
            </div>
        </div>

        <div class="TokenListMainCoin" style="flex: 1 0 0;">
            <div style="width: 100%; height: 25px; border-bottom: 1px solid rgba(44,26,80,0.9);"></div>

            {#if tokens}
                {#each Object.keys(tokens) as tokenAddress}
                    {@const token = tokens[tokenAddress]}
                    <div style="height: 15px;"></div>
                    <div class="CenterRowFlex TokenDataHolder">
                        <div>{token.symbol}</div>
                        <div>{(token.amount / (10 ** token.decimals)).toFixed(3)}</div>
                    </div>
                {/each}
            {/if}
        </div>
    {/if}
</div>

<style>
    .TokenListMainCoin {
        width: 95%;

        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;

        border-radius: 10px;

        position: relative;
        z-index: 2;
    }

    .OptionsMenu {
        width: 150px;
        height: 70px;

        position: absolute;
        top: 33px;
        right: -30px;
        z-index: 3;

        justify-content: flex-start;

        border-radius: 10px;
        background-color: rgba(237, 255, 232, 0.85);

        font-size: 18px;
        color: #101028;
        text-align: center;

        box-sizing: border-box;
        padding: 10px 0;
    }

    .WalletAddressHolder {
        width: 100%;
        flex: 1 0 0;
        font-size: 20px;
        text-align: center;
        overflow: hidden;
        color: rgba(10, 50, 100, 0.85);
    }

    .TokenDataHolder {
        width: 100%;
        height: 40px;

        box-sizing: border-box;
        padding: 0 15px;

        justify-content: space-between;
        background-color: rgba(161, 142, 118, 0.5);

        border-radius: 10px;

        font-size: 20px;
        cursor: pointer;
    }

    .TokenDataHolder:hover {
        background-color: rgba(161, 142, 118, 0.75);
    }
</style>