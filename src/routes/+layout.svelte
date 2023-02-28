<script lang="ts">
    import "../global.css";
    import { onMount } from "svelte";
    import Loader from "../lib/Components/Loader.svelte";
    import SideBarComponent from "../lib/Components/SideBarComponent.svelte";
    import { genericDataStore } from "../lib/Stores/GenericDataStore";
    import { walletListStore } from "../lib/Stores/WalletListStore";
    import { networkListStore } from "../lib/Stores/NetworkListStore";
    import type { WalletData } from "../lib/Schemas/WalletData";
    import { NetworkData } from "../lib/Schemas/NetworkData";

    let hasLoaded = false;
    onMount(async () => {
        let userDataPath = await window.electronAPI.getUserDataDirPath();
        $genericDataStore = {
            ...$genericDataStore,
            userDataPath,
            "appPasswordHash": await window.electronAPI.readTextFile(`${userDataPath}\\appPasswordHash.txt`) || ""
        };

        $walletListStore = (await window.electronAPI.readJsonFile(
            `${$genericDataStore["userDataPath"]}\\walletDataList.json`
        ) || []) as WalletData[];

        $networkListStore = await getListOfNetworks();

        setTimeout(() => {
            hasLoaded = true;
        }, 500);
    });

    let getListOfNetworks = async () => {
        let perWalletNetworks: { [walletId: string]: NetworkData[] } = {};
        for (let wallet of $walletListStore) {
            let data = await window.electronAPI.readJsonFile(
                `${$genericDataStore["userDataPath"]}\\wallets\\${wallet.id}\\networkDataList.json`
            );
            if (data != null) {
                perWalletNetworks[wallet.id] = data as NetworkData[];
            }
        }
        return perWalletNetworks;
    };
</script>

<div class="Wrapper">
    {#if hasLoaded}
        <SideBarComponent></SideBarComponent>
        <div class="ContentHolder">
            <slot></slot>
        </div>
    {:else}
        <Loader trackColor="#a1a1a1"></Loader>
    {/if}
</div>

<style>
    .ContentHolder {
        height: 100%;
        z-index: 0;
        overflow: hidden;

        position: absolute;
        top: 0;
        right: 100%;
        bottom: 100%;
        left: 40px;

        width: calc(100% - 40px);
    }
</style>
