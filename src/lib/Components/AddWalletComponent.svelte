<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import Loader from "./Loader.svelte";
    import { Web3Service } from "../Services/Web3Service";
    import { WalletService } from "../Services/WalletService";
    import { genericDataStore } from "../Stores/GenericDataStore";
    import { walletListStore } from "../Stores/WalletListStore";
    import type { NetworkCollection } from "../Stores/NetworkCollectionStore";
    import { networkCollectionStore } from "../Stores/NetworkCollectionStore";
    import type { SupportedNetworkData } from "../Configs/SupportedNetworks";
    import { supportedNetworkList } from "../Configs/SupportedNetworks";

    let showPhase = 0;
    let dispatch = createEventDispatcher();

    let appPassword = ""
    let passError = "";
    let walletName = "";
    let goToNextPhase = () => {
        switch (showPhase) {
            case 0: {
                if (!appPassword) {
                    return;
                }
                break;
            }
            case 1: {
                if (!walletName) {
                    return;
                }
                break;
            }
        }
        showPhase += 1;
    };

    let verifyPassword = async () => {
        let pass = appPassword;
        if (await window.electronAPI.verifyAppPassword(pass, $genericDataStore["appPasswordHash"])) {
            appPassword = pass;
            goToNextPhase();
        } else {
            passError = "Incorrect Password";
        }
    };

    let createNewWallet = async (supportedNetworkData: SupportedNetworkData) => {
        goToNextPhase();

        if (supportedNetworkData.type === "eth" || supportedNetworkData.type === "bsc" || supportedNetworkData.type === "polygon") {
            let newWallet = await Web3Service.createWallet(supportedNetworkData.type);

            let encryptedPhrases: string | null = null, encryptedIndex: string | null;
            let phrasesIv: string | null = null, indexIv: string | null = null;
            if (newWallet.phrase) {
                let data = await window.electronAPI.encryptWithAES256(newWallet.phrase, appPassword);
                encryptedPhrases = data.data;
                phrasesIv = data.iv;
            }
            if (newWallet.index) {
                let data = await window.electronAPI.encryptWithAES256("" + newWallet.index, appPassword);
                encryptedIndex = data.data;
                indexIv = data.iv;
            }

            let encryptedPrivateKey: string | null = null;
            let privateKeyIv: string | null = null;
            if (newWallet.privateKey) {
                let data = await window.electronAPI.encryptWithAES256(newWallet.privateKey, appPassword);
                encryptedPrivateKey = data.data;
                privateKeyIv = data.iv;
            }

            let walletNetworkData = WalletService.newWalletData(
                walletName, newWallet, supportedNetworkData,
                encryptedPhrases, phrasesIv,
                encryptedIndex, indexIv,
                encryptedPrivateKey, privateKeyIv
            );
            if (walletNetworkData.walletData != null && walletNetworkData.networkDataList != null) {
                $walletListStore = [
                    ...$walletListStore,
                    walletNetworkData.walletData
                ];

                let networkList: NetworkCollection = {
                    ...$networkCollectionStore
                };
                networkList[walletNetworkData.walletData.id] = walletNetworkData.networkDataList;
                $networkCollectionStore = networkList;

                await window.electronAPI.writeToFile(
                    `${$genericDataStore["userDataPath"]}\\walletDataList.json`,
                    JSON.stringify($walletListStore)
                );

                await window.electronAPI.writeToFile(
                    `${$genericDataStore["userDataPath"]}\\wallets\\` +
                    `${walletNetworkData.walletData.id}\\networkDataList.json`,
                    JSON.stringify($networkCollectionStore[walletNetworkData.walletData.id])
                );
            }
        }

        dispatch("closePopup");
    };
</script>

<div class="CenterColumnFlex AddWalletWrapper">
    {#if showPhase === 0}
        <div style="height: 15px; width: 10px;"></div>

        <div class="CenterRowFlex" style="width: 100%;">
            <div class="CenterRowFlex" style="width: 40%; text-align: center;">
                Password
            </div>
            <div class="CenterRowFlex" style="width: 5%; text-align: center;">
                :
            </div>
            <div class="CenterRowFlex" style="width: 55%; text-align: center;">
                <input bind:value="{appPassword}" type="password">
            </div>
        </div>

        <div style="height: 40px; width: 10px;"></div>

        <div class="CenterRowFlex ErrorMessageHolder">{passError}</div>
        <button on:click={verifyPassword}>Confirm</button>

        <div style="height: 15px; width: 10px;"></div>
    {:else if showPhase === 1}
        <div class="CenterColumnFlex" style="width: 100%; height: 40%; justify-content: space-around;">
            <div class="CenterRowFlex" style="width: 100%; text-align: center; font-size: 30px;">
                Wallet Name:
            </div>
            <input bind:value={walletName} placeholder="Wallet Name" type="text"/>
        </div>
        <button on:click={goToNextPhase}>Confirm</button>
    {:else if showPhase === 2}
        {#each supportedNetworkList as network}
            <div class="CenterRowFlex WalletTypeDataHolderWrapper">
                <button class="CenterRowFlex WalletTypeDataHolder"
                        on:click={() => createNewWallet(network)}
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

    .ErrorMessageHolder {
        height: 30px;
        text-align: center;
        font-size: 25px;
        color: #FF3D00;
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
        width: calc(95% + 10px);
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

        transition: 0.2s width, height;
    }

    button:hover {
        height: 55px;
        width: 155px;
    }

    button:active {
        height: 45px;
        width: 145px;
    }

    input:active {
        outline: none;
    }
</style>