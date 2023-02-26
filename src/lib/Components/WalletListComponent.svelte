<script lang="ts">
    let walletList = [
        {
            "name": "Wallet 1",
            "currencies": [
                {
                    "symbol": "ETH",
                    "amount": 1534530000000000000,
                    "decimals": 18
                }
            ]
        }
    ];
</script>

<div class="CenterColumnFlex Wrapper" style="background-color: #404258;">
    <div class="WalletHeader" style="text-align: center;">
        Wallets
    </div>
    <div class="CenterColumnFlex WalletBody">
        {#each walletList as { name, currencies }}
            <div class="WalletElement">
                <div class="WalletNameHolder">{name}</div>
                <div style="height: 5px; width: 100%;"></div>
                {#each currencies as { symbol, amount, decimals }}
                    <div class="CenterRowFlex" style="width: 100%; justify-content: space-between;">
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

        cursor: pointer;
    }

    .WalletElement:hover {
        background-color: #6b76b7;
    }

    .WalletElementSelected {
        background-color: #50577A;
    }

    .WalletNameHolder {
        width: 100%;
        border-bottom: 1px solid #a1a1a1;
        font-size: 20px;
        font-weight: bold;
    }
</style>