<script lang="ts">
    import { walletListStore } from "../Stores/WalletListStore";

    // TODO: Remove this assignment...
    $walletListStore = [
        {
            "name": "Wallet 1",
            "tokens": [
                {
                    "symbol": "ETH",
                    "amount": 1534530000000000000,
                    "decimals": 18
                }
            ]
        }
    ]
</script>

<div class="CenterColumnFlex Wrapper" style="background-color: #404258;">
    <div class="WalletHeader" style="text-align: center;">
        Wallets
    </div>
    <div class="CenterColumnFlex WalletBody">
        {#each $walletListStore as { name, tokens }}
            <div class="WalletElement">
                <div class="WalletNameHolder">{name}</div>
                <div style="height: 5px; width: 100%;"></div>
                {#each tokens as { symbol, amount, decimals }}
                    <div class="CenterRowFlex WalletChainDataHolder">
                        <div>{symbol}</div>
                        <div>{(amount / (10 ** decimals)).toFixed(3)}</div>
                    </div>
                {/each}
            </div>
        {/each}
    </div>
</div>

<style>
    .WalletHeader {
        height: 75px;
        width: 100%;
        font-size: 50px;
    }

    .WalletBody {
        width: 100%;
        height: calc(100% - 75px);
        justify-content: flex-start;

        overflow-x: hidden;
        overflow-y: auto;
    }

    .WalletElement {
        height: 125px;
        width: 95%;
        background-color: #6B728E;
        border-radius: 7px;

        box-sizing: border-box;
        padding: 10px;
    }

    .WalletChainDataHolder {
        width: 100%;
        justify-content: space-between;

        box-sizing: border-box;
        padding: 5px;

        border-radius: 7px;
        cursor: pointer;
    }

    .WalletChainDataHolder:hover {
        background-color: #5b65a4;
        border: 1px solid wheat;
    }

    .WalletElementSelected {
        background-color: #5b65a4;
        border: 1px solid wheat;
    }

    .WalletNameHolder {
        width: 100%;
        border-bottom: 1px solid #a1a1a1;
        font-size: 20px;
        font-weight: bold;
    }
</style>