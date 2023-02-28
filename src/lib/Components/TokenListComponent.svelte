<script lang="ts">
    import type { WalletData } from "../Schemas/WalletData";
    import type { NetworkData } from "../Schemas/NetworkData";
    import type { TokenData } from "../Schemas/TokenData";
    import { genericDataStore } from "../Stores/GenericDataStore";
    import { walletListStore } from "../Stores/WalletListStore";
    import { tokenListStore } from "../Stores/TokenListStore";

    let wallet: WalletData;
    let walletAddress: string;
    let network: NetworkData;
    let tokens: TokenData[] | undefined;

    $: {
        if ($genericDataStore["selectedWalletIndex"] != null) {
            wallet = $walletListStore[$genericDataStore["selectedWalletIndex"]];
        }
    }

    $: {
        if ($genericDataStore["selectedNetworkIndex"] != null && wallet) {
            network = wallet["blockchainNetworks"][$genericDataStore["selectedNetworkIndex"]];
            walletAddress = network["walletAddress"];
        }
    }

    $: {
        if ($tokenListStore) {
            tokens = $tokenListStore
        }
    }

    let copyAddress = async () => {
        if (walletAddress !== "Copied") {
            await window.electronAPI.copyToClipboard(walletAddress);

            walletAddress = "Copied";
            setTimeout(() => {
                walletAddress = network["walletAddress"];
            }, 1000);
        }
    };
</script>

<div class="CenterColumnFlex Wrapper" style="background-color: #4c4c65; justify-content: flex-start">
    {#if $genericDataStore["selectedWalletIndex"] != null}
        <div style="height: 25px;"></div>

        <div class="TokenListMainCoin" style="min-height: 150px; height: 150px; background-color: #6B728E;">
            <div style="height: 5px; width: 100%;"></div>

            <div class="CenterRowFlex WalletAddressHolder" style="justify-content: flex-end; text-align: right;">
                <i class="fa-solid fa-arrows-rotate" style="font-size: 18px; cursor: pointer;"></i>
                <div style="width: 15px;"></div>
                <i class="fa-solid fa-ellipsis-vertical" style="font-size: 18px; cursor: pointer;"></i>
                <div style="width: 15px;"></div>
            </div>

            <div class="CenterColumnFlex" style="width: 100%; flex: 4 0 0;">
                <div style="font-size: 45px; font-weight: bold;">
                    {(network["amount"] / (10 ** network["decimals"])).toFixed(3)}
                </div>
                <div style="font-size: 30px; font-weight: bold; cursor: pointer;">{network["symbol"]}</div>
            </div>

            <div class="CenterRowFlex WalletAddressHolder">
                {#if walletAddress === "Copied"}
                    {walletAddress}
                {:else}
                    {walletAddress.substring(0, 10)}......{walletAddress.substring(walletAddress.length - 9)}
                    <div style="width: 15px;"></div>
                    <i on:click={copyAddress} class="fa-regular fa-clipboard"
                       style="font-size: 18px; cursor:pointer;"></i>
                {/if}
            </div>
        </div>

        <div class="TokenListMainCoin" style="flex: 1 0 0;">
            <div style="width: 100%; height: 25px; border-bottom: 1px solid rgba(44,26,80,0.9);"></div>

            {#each tokens as token}
                <div style="height: 5px;"></div>
                <div></div>
            {/each}
        </div>
    {/if}
</div>

<style>
    .TokenListMainCoin {
        width: 95%;

        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;

        border-radius: 10px;
    }

    .WalletAddressHolder {
        width: 100%;
        flex: 1 0 0;
        font-size: 20px;
        text-align: center;
        overflow: hidden;
        color: rgba(10, 50, 100, 0.85);
    }
</style>