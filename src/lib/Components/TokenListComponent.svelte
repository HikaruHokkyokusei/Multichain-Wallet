<script lang="ts">
    import { walletListStore } from "../Stores/WalletListStore";
    import { genericDataStore } from "../Stores/GenericDataStore";
    import type { WalletData } from "../Schemas/WalletData";
    import type { NetworkData } from "../Schemas/NetworkData";
    import type { TokenData } from "../Schemas/TokenData";

    let wallet: WalletData;
    let publicKey: string;
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
            publicKey = network["publicKey"];
        }
    }

    $: {
        if (network) {
            tokens = network["tokens"]
        }
    }

    let copyAddress = async () => {
        if (publicKey !== "Copied") {
            await window.electronAPI.copyToClipboard(publicKey);

            publicKey = "Copied";
            setTimeout(() => {
                publicKey = network["publicKey"];
            }, 1000);
        }
    };
</script>

<div class="CenterColumnFlex Wrapper" style="background-color: #4c4c65; justify-content: flex-start">
    {#if $genericDataStore["selectedWalletIndex"] != null}
        <div style="height: 25px;"></div>

        <div class="TokenListMainCoin" style="min-height: 150px; height: 150px; background-color: #6B728E;">
            <div class="CenterColumnFlex" style="width: 100%; flex: 4 0 0;">
                <div style="font-size: 45px; font-weight: bold;">
                    {(network["amount"] / (10 ** network["decimals"])).toFixed(3)}
                </div>
                <div style="font-size: 30px; font-weight: bold; cursor: pointer;">{network["symbol"]}</div>
            </div>

            <div class="CenterRowFlex PublicKeyHolder">
                <div style="width: 85%; height: 100%; overflow: hidden;">
                    {publicKey}
                </div>
                {#if publicKey !== "Copied"}
                    <diV style="width: 40px; height: 100%; text-align: left; display: flex;">
                        ...&nbsp;&nbsp;
                        <i on:click={copyAddress} class="fa-regular fa-clipboard"
                           style="font-size: 18px; cursor:pointer;"></i>
                    </diV>
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

    .PublicKeyHolder {
        width: 100%;
        flex: 1 0 0;
        font-size: 20px;
        text-align: center;
        color: rgba(10, 50, 100, 0.85)
    }
</style>