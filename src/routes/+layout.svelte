<script lang="ts">
    import "../global.css";
    import { onMount } from "svelte";
    import { genericDataStore } from "$lib/Stores/GenericDataStore";

    let hasLoaded = false;
    let isMouseHoveringOnNavBar = false;

    onMount(async () => {
        $genericDataStore = {
            ...$genericDataStore,
            "userDataPath": await window.electronAPI.getUserDataDirPath()
        };

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
            Nav
            Bar
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
    }

    .SideBarBig {
        width: 150px;
        right: 150px;
    }

    .SideBarSmall {
        width: 40px;
        right: 40px;
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
