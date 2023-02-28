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
    import { networkListStore } from "../lib/Stores/NetworkListStore";
    import { tokenListStore } from "../lib/Stores/TokenListStore";
    import type { NetworkData } from "../lib/Schemas/NetworkData";
    import type { TokenData } from "../lib/Schemas/TokenData";

    let unlockWallet = () => {
        $genericDataStore = {
            ...$genericDataStore,
            "isAppLocked": false
        };
    };
    let closePopup = () => {
        $genericDataStore = {
            ...$genericDataStore,
            "showPopup": false
        }
    };

    let setActiveWalletAndNetwork = async (event) => {
        let walletIndex: number = event.detail.walletIndex, networkIndex: number = event.detail.networkIndex;
        $networkListStore = {};
        $tokenListStore = [];

        $genericDataStore = {
            ...$genericDataStore,
            "selectedWalletIndex": walletIndex,
            "selectedNetworkIndex": networkIndex
        }

        $networkListStore = await getListOfNetworks();

        $tokenListStore = (await window.electronAPI.readJsonFile(
            `${$genericDataStore["userDataPath"]}\\wallets\\` +
            `${$walletListStore[walletIndex]["id"]}\\` +
            `${$networkListStore[networkIndex]}\\tokenDataList.json`
        ) || []) as TokenData[];
    };

    let getListOfNetworks = async () => {
        let perWalletNetworks: { [walletId: string]: NetworkData[] } = {};
        for (let wallet of $walletListStore) {
            let data = await window.electronAPI.readJsonFile(
                `${$genericDataStore["userDataPath"]}\\wallets\\${wallet.id}\\networkDataList.json`
            );
            if (data != null) {
                perWalletNetworks[wallet.id] = data as NetworkData[];
            }
        }
        return perWalletNetworks;
    };

    // let updateAmounts = () => {
    //    if (networkData) {
    //         let fetchList: FetchToken[] = [
    //             {walletType: networkData.type, holderAddress: networkData.walletAddress, isContract: false}
    //         ];
    //         if (tokens) {
    //             for (let token of tokens) {
    //                 fetchList.push({
    //                     walletType: networkData.type,
    //                     holderAddress: networkData.walletAddress,
    //                     isContract: true,
    //                     contractAddress: token.contractAddress
    //                 });
    //             }
    //         }
    //         Web3Service.getTokenAmounts(fetchList).then((amounts) => {
    //             if (networkData) {
    //                 $walletListStore = {
    //                     ...$walletListStore,
    //
    //                 };
    //             }
    //         });
    //    }
    // };
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