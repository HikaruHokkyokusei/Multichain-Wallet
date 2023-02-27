<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { Web3Service } from "$lib/Services/Web3Service";
    import { walletListStore } from "$lib/Stores/WalletListStore";
    import type { SupportedNetworkData } from "$lib/Configs/SupportedNetworks";
    import { supportedNetworkList } from "$lib/Configs/SupportedNetworks";
    import { genericDataStore } from "$lib/Stores/GenericDataStore";
    import Loader from "./Loader.svelte";
    import { v4 } from "uuid";

    let showPhase = 0;
    let dispatch = createEventDispatcher();

    let walletName = "";
    let goToNextPhase = () => {
        switch (showPhase) {
            case 0: {
                if (!walletName) {
                    return;
                }
                break;
            }
        }
        showPhase += 1;
    };

    let createNewWallet = async (network: SupportedNetworkData) => {
        goToNextPhase();
        if (network["type"] === "eth" || network["type"] === "bsc" || network["type"] === "polygon") {
            let newWallet = await Web3Service.createWallet(network["type"]);
            $walletListStore = [
                ...$walletListStore,
                {
                    "id": `${v4()}${v4()}`,
                    "name": walletName,
                    "phrase": newWallet["phrase"], // TODO: Encrypt this...
                    "index": newWallet["index"], // TODO: Encrypt this...
                    "blockchainNetworks": [
                        {
                            "name": network["name"],
                            "symbol": network["symbol"],
                            "type": network["type"],
                            "amount": 0,
                            "decimals": network["decimals"],
                            "publicKey": newWallet["publicKey"],
                            "privateKey": newWallet["privateKey"], // TODO: Encrypt this...
                            "tokens": []
                        }
                    ]
                }
            ];

            await window.electronAPI.writeToFile(
                `${$genericDataStore["userDataPath"]}/walletList.json`,
                JSON.stringify($walletListStore)
            );
        }
        dispatch("closePopup");
    };
</script>

<div class="CenterColumnFlex AddWalletWrapper">
    {#if showPhase === 0}
        <div class="CenterColumnFlex" style="width: 100%; height: 40%; justify-content: space-around;">
            <div class="CenterRowFlex" style="width: 100%; text-align: center; font-size: 30px;">
                Wallet Name:
            </div>
            <input bind:value={walletName} type="text"/>
        </div>
        <button on:click={goToNextPhase}>Confirm</button>
    {:else if showPhase === 1}
        {#each supportedNetworkList as network}
            <div class="CenterRowFlex WalletTypeDataHolderWrapper">
                <button class="CenterRowFlex WalletTypeDataHolder"
                        on:click={() => createNewWallet(network)}
                >
                    {network["name"]}
                </button>
            </div>
        {/each}
    {:else if showPhase === 2}
        <Loader></Loader>
    {/if}
</div>

<style>
    .AddWalletWrapper {
        width: 400px;
        height: 80%;

        border: 2px solid rgba(31, 30, 30, 0.80);
        border-radius: 10px;

        justify-content: space-around;
    }

    .WalletTypeDataHolderWrapper {
        width: 92%;
        height: 65px;
    }

    .WalletTypeDataHolder {
        width: 95%;
        height: 60px;

        text-align: center;
        font-size: 25px;

        border-radius: 15px;
        background-color: blanchedalmond;
        color: mediumslateblue;

        transition: 0.2s width, height;
    }

    .WalletTypeDataHolder:hover {
        width: calc(95% + 10);
        height: 65px;
    }

    .WalletTypeDataHolder:active {
        width: calc(95% - 10px);
        height: 60px;
    }

    input, button {
        outline: none;
        border: none;

        border-radius: 10px;
    }

    input {
        width: 275px;
        height: 35px;
        font-size: 20px;

        box-sizing: border-box;
        padding: 5px 13px;
    }

    button {
        height: 50px;
        width: 150px;
        font-size: 30px;
    }

    input:active {
        outline: none;
    }
</style>