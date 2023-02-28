<script lang="ts">
    import type { NetworkData } from "../Schemas/NetworkData";
    import type { TokenData } from "../Schemas/TokenData";
    import { genericDataStore } from "../Stores/GenericDataStore";
    import { walletListStore } from "../Stores/WalletListStore";
    import { networkListStore } from "../Stores/NetworkListStore";
    import { tokenListStore } from "../Stores/TokenListStore";

    let walletAddress: string;
    let networkData: NetworkData | null;
    let tokens: TokenData[];

    $: {
        if ($genericDataStore["selectedNetworkIndex"] != null) {
            if ($networkListStore[$walletListStore[$genericDataStore["selectedWalletIndex"]].id]) {
                networkData = $networkListStore[$walletListStore[$genericDataStore["selectedWalletIndex"]].id][$genericDataStore["selectedNetworkIndex"]];
            } else {
                networkData = null;
            }
        } else {
            networkData = null;
        }
    }
    $: {
        if (networkData) {
            walletAddress = networkData.walletAddress;
        }
    }
    $: {
        if (networkData && $tokenListStore) {
            tokens = $tokenListStore
        } else {
            tokens = [];
        }
    }

    let copyAddress = async () => {
        if (walletAddress !== "Copied") {
            await window.electronAPI.copyToClipboard(walletAddress);

            walletAddress = "Copied";
            setTimeout(() => {
                if (networkData) {
                    walletAddress = networkData["walletAddress"];
                }
            }, 1000);
        }
    };
</script>

<div class="CenterColumnFlex Wrapper" style="background-color: #4c4c65; justify-content: flex-start">
    {#if networkData != null}
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
                    {(networkData["amount"] / (10 ** networkData["decimals"])).toFixed(3)}
                </div>
                <div style="font-size: 30px; font-weight: bold; cursor: pointer;">{networkData["symbol"]}</div>
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

            {#if tokens}
                {#each tokens as token}
                    <div style="height: 5px;"></div>
                    <div>{token.symbol}</div>
                    <div>{(token.amount / (10 ** token.decimals)).toFixed(3)}</div>
                {/each}
            {/if}
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