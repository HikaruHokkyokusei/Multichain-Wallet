<script lang="ts">
    import { genericDataStore } from "../Stores/GenericDataStore.js";
    import { walletListStore } from "../Stores/WalletListStore";
    import { tokenListStore } from "../Stores/TokenListStore";
    import type { TokenData } from "../Schemas/TokenData";

    let setActiveWalletAndNetwork = (walletIndex: number, networkIndex: number) => {
        $tokenListStore = [];

        $genericDataStore = {
            ...$genericDataStore,
            "selectedWalletIndex": walletIndex,
            "selectedNetworkIndex": networkIndex
        }

        window.electronAPI.readJsonFile(
            `${$genericDataStore["userDataPath"]}/wallets/` +
            $walletListStore[walletIndex]["id"] +
            `/tokenList.json`
        ).then((data) => {
            $tokenListStore = (data || []) as TokenData[];
        });
    };
</script>

<div class="CenterColumnFlex Wrapper" style="background-color: #404258;">
    <div class="WalletHeader" style="text-align: center;">
        Wallets
    </div>
    <div class="CenterColumnFlex WalletBody">
        {#each $walletListStore as { id, name, blockchainNetworks }, idx1}
            <div style="width: 100%; height: 10px;"></div>
            <div class="WalletElement">
                <div class="CenterRowFlex WalletNameHolder" style="justify-content: space-between">
                    <div>
                        {name}
                    </div>
                    <div class="CenterRowFlex" style="width: 20px; cursor: pointer">
                        <i class="fa-solid fa-ellipsis-vertical"
                           style="font-size: 17px; color: rgba(10, 50, 100, 0.85);"></i>
                    </div>
                </div>
                <div style="height: 3px; width: 100%;"></div>
                {#each blockchainNetworks as blockchainNetwork, idx2}
                    <div style="height: 2px; width: 100%;"></div>
                    <div on:click="{() => setActiveWalletAndNetwork(idx1, idx2)}"
                         class="CenterRowFlex WalletChainDataHolder"
                         class:WalletElementSelected={$genericDataStore["selectedWalletIndex"] === idx1 && $genericDataStore["selectedNetworkIndex"] === idx2}
                    >
                        <div>{blockchainNetwork["symbol"]}</div>
                        <div>{(blockchainNetwork["amount"] / (10 ** blockchainNetwork["decimals"])).toFixed(3)}</div>
                    </div>
                {/each}
            </div>
        {/each}
    </div>
</div>

<style>
    .WalletHeader {
        height: 75px;
        width: 100%;
        font-size: 50px;
    }

    .WalletBody {
        width: 100%;
        height: calc(100% - 75px);
        justify-content: flex-start;

        overflow-x: hidden;
        overflow-y: auto;
    }

    .WalletElement {
        min-height: 125px;
        width: 95%;
        background-color: #6B728E;
        border-radius: 7px;

        box-sizing: border-box;
        padding: 10px;
    }

    .WalletChainDataHolder {
        width: 100%;
        justify-content: space-between;

        box-sizing: border-box;
        padding: 5px;

        border-radius: 7px;
        cursor: pointer;
    }

    .WalletChainDataHolder:hover {
        background-color: #5b65a4;
        border: 1px solid wheat;
    }

    .WalletElementSelected {
        background-color: #5b65a4;
        border: 1px solid wheat;
    }

    .WalletNameHolder {
        width: 100%;
        border-bottom: 1px solid #a1a1a1;
        font-size: 20px;
        font-weight: bold;
    }
</style>