<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { Web3Service } from "../Services/Web3Service";
    import { walletListStore } from "../Stores/WalletListStore";
    import type { SupportedNetworkData } from "../Configs/SupportedNetworks";
    import { supportedNetworkList } from "../Configs/SupportedNetworks";
    import { genericDataStore } from "../Stores/GenericDataStore";
    import Loader from "./Loader.svelte";
    import { newWalletData } from "../Services/WalletService";

    let showPhase = 0;
    let dispatch = createEventDispatcher();

    let walletName = "";
    let selectedImportEntityType = 0;
    let importEntity = "";
    let allowedImportTypes = [
        { id: 0, name: "Private Key" },
        { id: 1, name: "Phrases" }
    ];

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

    let importNewWallet = async (network: SupportedNetworkData) => {
        goToNextPhase();
        if ((selectedImportEntityType === 0 || selectedImportEntityType === 1) && (network.type === "eth" || network.type === "bsc" || network.type === "polygon")) {
            let newWallet = Web3Service.importWallet(selectedImportEntityType, importEntity, network.type);

            let walletListData = newWalletData(walletName, newWallet, network);
            if (walletListData != null) {
                $walletListStore = [
                    ...$walletListStore,
                    walletListData
                ];
            }

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
            <input bind:value={walletName} placeholder="Wallet Name" type="text"/>
        </div>
        <button on:click={goToNextPhase}>Confirm</button>
    {:else if showPhase === 1}
        <div class="CenterColumnFlex" style="width: 100%; height: 40%; justify-content: space-around;">
            <div class="CenterColumnFlex" style="width: 100%; text-align: center; font-size: 30px;">
                Import from:
                <br>
                <select bind:value={selectedImportEntityType}>
                    {#each allowedImportTypes as importType}
                        <option value="{importType['id']}">
                            {importType["name"]}
                        </option>
                    {/each}
                </select>
            </div>
            <input bind:value={importEntity} placeholder="{allowedImportTypes[selectedImportEntityType]['name']}"
                   type="text"/>
        </div>
        <button on:click={goToNextPhase}>Confirm</button>
    {:else if showPhase === 2}
        {#each supportedNetworkList as network}
            <div class="CenterRowFlex WalletTypeDataHolderWrapper">
                <button class="CenterRowFlex WalletTypeDataHolder"
                        on:click={() => importNewWallet(network)}
                >
                    {network["name"]}
                </button>
            </div>
        {/each}
    {:else if showPhase === 3}
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

    select {
        outline: none;
        border: none;

        font-size: 25px;
    }
</style>