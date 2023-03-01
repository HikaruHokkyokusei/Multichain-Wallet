<script lang="ts">
    import WalletListComponent from "../lib/Components/WalletListComponent.svelte";
    import TokenListComponent from "../lib/Components/TokenListComponent.svelte";
    import TokenDataComponent from "../lib/Components/TokenDataComponent.svelte";
    import SetPasswordComponent from "../lib/Components/SetPasswordComponent.svelte";
    import UnlockAppComponent from "../lib/Components/UnlockAppComponent.svelte";
    import PopupComponent from "../lib/Components/PopupComponent.svelte";
    import AddWalletComponent from "../lib/Components/AddWalletComponent.svelte";
    import ImportWalletComponent from "../lib/Components/ImportWalletComponent.svelte";
    import { genericDataStore } from "../lib/Stores/GenericDataStore";
    import { walletListStore } from "../lib/Stores/WalletListStore";
    import type { NetworkCollection } from "../lib/Stores/NetworkCollectionStore";
    import { networkCollectionStore } from "../lib/Stores/NetworkCollectionStore";
    import { tokenListStore } from "../lib/Stores/TokenListStore";
    import type { NetworkData } from "../lib/Schemas/NetworkData";
    import type { TokenData } from "../lib/Schemas/TokenData";
    import ImportEvmErc20TokenComponent from "../lib/Components/ImportEvmErc20TokenComponent.svelte";

    let unlockWallet = () => {
        $genericDataStore = {
            ...$genericDataStore,
            "isAppLocked": false
        };
    };
    let closePopup = () => {
        $genericDataStore = {
            ...$genericDataStore,
            "showPopup": false,
            "popupType": undefined,
            "popupParams": undefined
        }
    };

    let setActiveWalletAndNetwork = async (event) => {
        let walletIndex: number = event.detail.walletIndex;
        let networkType: string = event.detail.networkType;

        $networkCollectionStore = {};
        $tokenListStore = {};

        $genericDataStore = {
            ...$genericDataStore,
            "selectedWalletIndex": walletIndex,
            "selectedNetworkType": networkType
        }

        $networkCollectionStore = await getListOfNetworks();

        $tokenListStore = (await window.electronAPI.readJsonFile(
            `${$genericDataStore["userDataPath"]}\\wallets\\` +
            `${$walletListStore[walletIndex]["id"]}\\${networkType}\\tokenDataList.json`
        ) || {}) as { [networkType: string]: TokenData };
    };

    // Copy of function in +layout.svelte
    let getListOfNetworks = async () => {
        let networkCollection: NetworkCollection = {};
        for (let wallet of $walletListStore) {
            let data = await window.electronAPI.readJsonFile(
                `${$genericDataStore["userDataPath"]}\\wallets\\${wallet.id}\\networkDataList.json`
            );
            if (data != null) {
                networkCollection[wallet.id] = data as { [networkType: string]: NetworkData };
            }
        }
        return networkCollection;
    };
</script>

<div class="Wrapper CenterRowFlex" style="background-color: #404258; position:relative;">
    {#if $genericDataStore["appPasswordHash"] === null}
        <SetPasswordComponent on:unlockWallet={unlockWallet}></SetPasswordComponent>
    {:else if $genericDataStore["isAppLocked"]}
        <UnlockAppComponent on:unlockWallet={unlockWallet}></UnlockAppComponent>
    {:else}
        <div class="PrimarySubComponent">
            <WalletListComponent on:setActiveWalletAndNetwork={setActiveWalletAndNetwork}></WalletListComponent>
        </div>
        <div class="PrimarySubComponent">
            <TokenListComponent></TokenListComponent>
        </div>
        <div class="PrimarySubComponent">
            <TokenDataComponent></TokenDataComponent>
        </div>

        {#if $genericDataStore["showPopup"]}
            <PopupComponent on:closePopup={closePopup}>
                {#if $genericDataStore["popupType"] === "addWallet"}
                    <AddWalletComponent on:closePopup={closePopup}></AddWalletComponent>
                {:else if $genericDataStore["popupType"] === "importWallet"}
                    <ImportWalletComponent on:closePopup={closePopup}></ImportWalletComponent>
                {:else if $genericDataStore["popupType"] === "importEvmErc20Token"}
                    <ImportEvmErc20TokenComponent on:closePopup={closePopup}></ImportEvmErc20TokenComponent>
                {/if}
            </PopupComponent>
        {/if}
    {/if}
</div>

<style>
    .PrimarySubComponent {
        max-width: 33.334%;
        flex: 1 0 0;
        height: 100%;
    }
</style>