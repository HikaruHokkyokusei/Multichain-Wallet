<script lang="ts">
    import { createEventDispatcher } from "svelte";

    let dispatch = createEventDispatcher();
</script>

<div class="CenterRowFlex Wrapper PopupWrapper">
    <div class="CenterColumnFlex PopupContentHolder">
        <slot></slot>
        <div class="CenterRowFlex PopupCloseButtonHolder">
            <button class="CenterRowFlex PopupCloseButton" on:click={() => dispatch("closePopup")}>X</button>
        </div>
    </div>
</div>

<style>
    .PopupWrapper {
        position: absolute;
        top: 0;
        bottom: 0;

        width: 100%;
        height: 100%;

        background-color: rgba(0, 0, 0, 0.45);
    }

    .PopupContentHolder {
        width: 75%;
        height: 80%;

        position: relative;

        background-color: lightslategray;

        border-radius: 25px;
        border: 1px solid black;
    }

    .PopupCloseButtonHolder {
        width: 25px;
        height: 25px;

        position: absolute;
        top: 15px;
        right: 15px;
    }

    .PopupCloseButton {
        width: 25px;
        height: 25px;

        text-align: center;

        border-radius: 5px;
        border: none;

        background-color: darkseagreen;
        transition: 175ms width, height;
    }

    .PopupCloseButton:active {
        width: 23px;
        height: 23px;
    }
</style>