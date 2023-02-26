<script lang="ts">
    import "../global.css";
    import { onMount } from "svelte";
    import { genericDataStore } from "$lib/Stores/GenericDataStore";
    import { walletListStore } from "$lib/Stores/WalletListStore";
    import SideBarComponent from "../lib/Components/SideBarComponent.svelte";

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
        <div class="CenterRowFlex Wrapper">
            <span class="HomeLoader"></span>
        </div>
    {/if}
</div>

<style>
    .HomeLoader {
        width: 48px;
        height: 48px;
        border: 5px solid #FFF;
        border-bottom-color: #FF3D00;
        border-radius: 50%;
        display: inline-block;
        box-sizing: border-box;
        animation: homeLoaderRotation 1s linear infinite;
    }

    @keyframes homeLoaderRotation {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }

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
