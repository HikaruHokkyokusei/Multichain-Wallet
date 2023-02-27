<script lang="ts">
    // TODO: Remove the two assignments below...
    let walletAddress = "0x00000000000000000000";
    let currencies = [
        {
            "symbol": "ETH",
            "amount": 1534530000000000000,
            "decimals": 18
        }
    ];
</script>

<div class="CenterColumnFlex Wrapper" style="background-color: #4c4c65; justify-content: flex-start">
    <div style="height: 25px;"></div>

    <div class="TokenListMainCoin">
        <div class="CenterColumnFlex" style="width: 100%; flex: 9 0 0">
            <div style="font-size: 45px; font-weight: bold;">
                {(currencies[0]["amount"] / (10 ** currencies[0]["decimals"])).toFixed(3)}
            </div>
            <div style="font-size: 30px; font-weight: bold;">{currencies[0]["symbol"]}</div>
        </div>
        <div style="width: 100%; flex: 1 0 0; font-size: 20px; text-align: center; color: rgba(10,50,100,0.85)">{walletAddress}</div>
    </div>

    <div style="width: 100%; height: 25px; border-bottom: 1px solid rgba(44,26,80,0.9);"></div>

    {#each currencies.slice(0).slice(1) as currency}
        <div style="height: 5px;"></div>
        <div></div>
    {/each}
</div>

<style>
    .TokenListMainCoin {
        height: 150px;
        width: 95%;

        display: flex;
        flex-direction: column;

        background-color: #6B728E;

        border-radius: 10px;
        cursor: pointer;
    }
</style>