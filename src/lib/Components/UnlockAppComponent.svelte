<script lang="ts">
    import { genericDataStore } from "$lib/Stores/GenericDataStore";
    import { createEventDispatcher } from "svelte";

    let appPassword, passError = "";
    let dispatch = createEventDispatcher();

    let verifyPassword = async () => {
        if (await window.electronAPI.verifyAppPassword(appPassword, $genericDataStore["appPasswordHash"])) {
            dispatch('unlockWallet');
        } else {
            passError = "Incorrect Password";
        }
    };
</script>

<div class="CenterColumnFlex CredInputHolder">
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
</div>

<style>
    .CredInputHolder {
        min-width: 600px;
        min-height: 300px;
        width: 45%;
        height: 25%;

        justify-content: space-around;

        background-color: #4c4c65;
        border-radius: 25px;

        font-size: 30px;
    }

    .ErrorMessageHolder {
        height: 30px;
        text-align: center;
        font-size: 25px;
        color: #FF3D00;
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