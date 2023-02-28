<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { genericDataStore } from "../Stores/GenericDataStore.js";
    import { walletListStore } from "../Stores/WalletListStore";
    import { networkCollectionStore } from "../Stores/NetworkCollectionStore.js";

    let dispatch = createEventDispatcher();
</script>

<div class="CenterColumnFlex Wrapper" style="background-color: #404258;">
    <div class="WalletHeader" style="text-align: center;">
        Wallets
    </div>
    <div class="CenterColumnFlex WalletBody">
        {#if $walletListStore}
            {#each $walletListStore as { id, name }, idx1}
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

                    {#if $networkCollectionStore[$walletListStore[idx1].id] != null}
                        {@const networkCollection = $networkCollectionStore[$walletListStore[idx1].id]}
                        {#each Object.keys(networkCollection) as networkType}
                            {@const networkData = networkCollection[networkType]}

                            <div style="height: 2px; width: 100%;"></div>
                            <div on:click="{() => dispatch('setActiveWalletAndNetwork', {
                                     'walletIndex': idx1,
                                     'networkType': networkType
                                 })}"
                                 class="CenterRowFlex WalletChainDataHolder"
                                 class:WalletElementSelected={
                                     $genericDataStore["selectedWalletIndex"] === idx1 &&
                                     $genericDataStore["selectedNetworkType"] === networkType
                                 }
                            >
                                <div>{networkData["symbol"]}</div>
                                <div>{(networkData["amount"] / (10 ** networkData["decimals"])).toFixed(3)}</div>
                            </div>
                        {/each}
                    {/if}
                </div>
            {/each}
        {/if}
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