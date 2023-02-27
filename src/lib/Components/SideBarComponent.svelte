<script lang="ts">
    import { fly } from "svelte/transition";
    import { genericDataStore } from "$lib/Stores/GenericDataStore";

    let isMouseHoveringOnNavBar = false;

    let showPopup = () => {
        $genericDataStore = {
            ...$genericDataStore,
            "showPopup": true
        };
    };
</script>

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
        <div on:click={showPopup} class="CenterRowFlex" style="width: 100%; cursor: pointer; height: 50px;">
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

<style>
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
</style>
