<script lang="ts">
    import { genericDataStore } from "$lib/Stores/GenericDataStore";
    import WalletListComponent from "$lib/Components/WalletListComponent.svelte";
    import TokenListComponent from "$lib/Components/TokenListComponent.svelte";
    import TokenDataComponent from "$lib/Components/TokenDataComponent.svelte";
    import SetPasswordComponent from "$lib/Components/SetPasswordComponent.svelte";
    import UnlockAppComponent from "$lib/Components/UnlockAppComponent.svelte";
    import PopupComponent from "$lib/Components/PopupComponent.svelte";
    import AddWalletComponent from "$lib/Components/AddWalletComponent.svelte";

    let unlockApp = () => {
        $genericDataStore = {
            ...$genericDataStore,
            "isAppLocked": false
        };
    };
</script>

<div class="Wrapper CenterRowFlex" style="background-color: #404258; position:relative;">
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

        {#if $genericDataStore["showPopup"]}
            <PopupComponent>
                <AddWalletComponent></AddWalletComponent>
            </PopupComponent>
        {/if}
    {/if}
</div>

<style>
    .PrimarySubComponent {
        flex: 1 0 0;
        height: 100%;
    }
</style>