<script lang="ts">
    import "../global.css";
    import { onMount } from "svelte";
    import { fly } from "svelte/transition";
    import { genericDataStore } from "$lib/Stores/GenericDataStore";
    import { walletListStore } from "$lib/Stores/WalletListStore";

    let hasLoaded = false;
    let isMouseHoveringOnNavBar = false;

    onMount(async () => {
        $genericDataStore = {
            ...$genericDataStore,
            "userDataPath": await window.electronAPI.getUserDataDirPath()
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
        <nav
                class="SideBar {isMouseHoveringOnNavBar ? 'SideBarBig' : 'SideBarSmall'}"
                on:mouseenter={() => {isMouseHoveringOnNavBar = true;}}
                on:mouseleave={() => {isMouseHoveringOnNavBar = false;}}
        >
            <div style="height: 10px; width: 100%;"></div>

            <div class="SideBarIconHolder">
                <div class="SideBarIconBars"></div>
                <div class="SideBarIconBars"></div>
                <div class="SideBarIconBars"></div>
            </div>

            <div style="height: 15px; width: 100%;"></div>

            <div class="CenterColumnFlex SideBarOptionHolder">
                <div class="CenterRowFlex" style="width: 100%; cursor: pointer; height: 50px;">
                    <i class="fa-solid fa-plus" style="color: black; opacity: 0.4; font-size: 40px;"></i>
                    {#if isMouseHoveringOnNavBar}
                        <div style="width: 10px;"></div>
                        <div transition:fly={{x: -25, duration: 500}} style="font-size: 20px;">Create<br>Wallet</div>
                    {/if}
                </div>

                <div style="height: 15px;"></div>

                <div class="CenterRowFlex" style="width: 100%; cursor: pointer; height: 50px;">
                    <i class="fa-solid fa-file-import" style="color: black; opacity: 0.4; font-size: 30px;"></i>
                    {#if isMouseHoveringOnNavBar}
                        <div style="width: 10px;"></div>
                        <div transition:fly={{x: -25, duration: 500}} style="font-size: 20px;">Import<br>Wallet</div>
                    {/if}
                </div>
            </div>
        </nav>
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

    .SideBar {
        height: 100%;
        z-index: 1;
        background-color: #594faf;

        position: absolute;
        top: 0;
        bottom: 100%;
        left: 0;

        transition: 500ms width;

        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
    }

    .SideBarBig {
        width: 175px;
        right: 175px;
    }

    .SideBarSmall {
        width: 40px;
        right: 40px;
    }

    .SideBarIconHolder {
        height: 30px;
        width: 75%;

        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
    }

    .SideBarIconBars {
        width: 100%;
        height: 6px;

        border-top: 6px;
        border-radius: 3px;
        background-color: black;
        opacity: 0.4;
    }

    .SideBarOptionHolder {
        width: 75%;
        height: 100%;
        justify-content: flex-start;

        box-sizing: border-box;
        padding: 10px 0;
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
