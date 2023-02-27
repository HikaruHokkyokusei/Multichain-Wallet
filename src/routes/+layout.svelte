<script lang="ts">
    import "../global.css";
    import { onMount } from "svelte";
    import { genericDataStore } from "$lib/Stores/GenericDataStore";
    import { walletListStore } from "$lib/Stores/WalletListStore";
    import SideBarComponent from "../lib/Components/SideBarComponent.svelte";
    import Loader from "../lib/Components/Loader.svelte";

    let hasLoaded = false;
    onMount(async () => {
        let userDataPath = await window.electronAPI.getUserDataDirPath();
        $genericDataStore = {
            ...$genericDataStore,
            userDataPath,
            "appPasswordHash": await window.electronAPI.readTextFile(`${userDataPath}/appPasswordHash.txt`)
        };

        $walletListStore = (await window.electronAPI.readJsonFile(
            `${$genericDataStore["userDataPath"]}/walletList.json`
        )) || [];

        setTimeout(() => {
            hasLoaded = true;
        }, 500);
    });
</script>

<div class="Wrapper">
    {#if hasLoaded}
        <SideBarComponent></SideBarComponent>
        <div class="ContentHolder">
            <slot></slot>
        </div>
    {:else}
        <Loader></Loader>
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
