<script lang="ts">
    import Web3 from "web3";
    import { genericDataStore } from "$lib/Stores/GenericDataStore";
    import WalletListComponent from "$lib/Components/WalletListComponent.svelte";
    import TokenListComponent from "$lib/Components/TokenListComponent.svelte";
    import TokenDataComponent from "$lib/Components/TokenDataComponent.svelte";
    import SetPasswordComponent from "$lib/Components/SetPasswordComponent.svelte";
    import UnlockAppComponent from "$lib/Components/UnlockAppComponent.svelte";

    const web3 = new Web3("https://bsc-dataseed1.binance.org/");

    let unlockApp = () => {
        $genericDataStore = {
            ...$genericDataStore,
            "isAppLocked": false
        };
    };
</script>

<div class="Wrapper CenterRowFlex" style="background-color: #404258">
    {#if $genericDataStore["appPasswordHash"] === null}
        <SetPasswordComponent on:unlockWallet={unlockApp}></SetPasswordComponent>
    {:else if $genericDataStore["isAppLocked"]}
        <UnlockAppComponent on:unlockWallet={unlockApp}></UnlockAppComponent>
    {:else}
        <div class="PrimarySubComponent">
            <WalletListComponent></WalletListComponent>
        </div>
        <div class="PrimarySubComponent">
            <TokenListComponent></TokenListComponent>
        </div>
        <div class="PrimarySubComponent">
            <TokenDataComponent></TokenDataComponent>
        </div>
    {/if}
</div>

<style>
    .PrimarySubComponent {
        flex: 1 0 0;
        height: 100%;
    }
</style>