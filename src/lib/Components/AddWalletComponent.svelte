<script lang="ts">
    import { Web3Service } from "$lib/Services/Web3Service";

    let walletTypeList = [
        { "name": "Bitcoin", "type": "btc" },
        { "name": "Ethereum", "type": "eth" },
        { "name": "Binance Smart Chain", "type": "bsc" },
        { "name": "Polygon", "type": "polygon" },
        { "name": "XRP Ripple", "type": "xrp" }
    ];

    let createNewWallet = async (walletType: string) => {
        if (walletType === "eth" || walletType === "bsc" || walletType === "polygon") {
            console.log(await Web3Service.createWallet(walletType));
        }
    };
</script>

<div class="CenterColumnFlex AddWalletWrapper">
    {#each walletTypeList as walletType}
        <div class="CenterRowFlex WalletTypeDataHolderWrapper">
            <div class="CenterRowFlex WalletTypeDataHolder" on:click={() => createNewWallet(walletType["type"])}>
                {walletType["name"]}
            </div>
        </div>
    {/each}
</div>

<style>
    .AddWalletWrapper {
        width: 400px;
        height: 80%;

        border: 2px solid rgba(31, 30, 30, 0.80);
        border-radius: 10px;

        justify-content: space-around;
    }

    .WalletTypeDataHolderWrapper {
        width: 92%;
        height: 65px;
    }

    .WalletTypeDataHolder {
        width: 95%;
        height: 60px;

        padding: 5px;

        text-align: center;
        font-size: 25px;

        border-radius: 15px;
        background-color: blanchedalmond;
        color: mediumslateblue;

        transition: 0.2s padding;
    }

    .WalletTypeDataHolder:hover {
        padding: 10px;
    }

    .WalletTypeDataHolder:active {
        padding: 0;
    }
</style>