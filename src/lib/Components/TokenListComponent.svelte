<script lang="ts">
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
    <div class="CenterColumnFlex TokenListMainCoin">
        <div style="font-size: 45px; font-weight: bold;">
            {(currencies[0]["amount"] / (10 ** currencies[0]["decimals"])).toFixed(3)}
        </div>
        <div style="font-size: 30px; font-weight: bold;">{currencies[0]["symbol"]}</div>
        <div style="font-size: 20px;">{walletAddress}</div>
    </div>
    {#each currencies.slice(0).slice(1) as currency}
        <div style="height: 5px;"></div>
        <div></div>
    {/each}
</div>

<style>
    .TokenListMainCoin {
        height: 175px;
        width: 95%;

        background-color: #6B728E;

        border-radius: 10px;
        cursor: pointer;
    }
</style>