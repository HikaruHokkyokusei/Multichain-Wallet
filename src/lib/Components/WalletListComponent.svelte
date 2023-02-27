<script lang="ts">
    import { walletListStore } from "$lib/Stores/WalletListStore";
    import { genericDataStore } from "$lib/Stores/GenericDataStore.js";

    let setActiveWalletAndNetwork = (walletIndex, networkIndex) => {
        $genericDataStore = {
            ...$genericDataStore,
            "selectedWalletIndex": walletIndex,
            "selectedNetworkIndex": networkIndex
        }
    };
</script>

<div class="CenterColumnFlex Wrapper" style="background-color: #404258;">
    <div class="WalletHeader" style="text-align: center;">
        Wallets
    </div>
    <div class="CenterColumnFlex WalletBody">
        {#each $walletListStore as { id, name, blockchainNetworks }, idx1}
            <div class="WalletElement">
                <div class="WalletNameHolder">{name}</div>
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