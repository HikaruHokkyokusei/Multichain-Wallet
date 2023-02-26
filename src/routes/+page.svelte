<script lang="ts">
    import Web3 from "web3";
    import WalletListComponent from "$lib/Components/WalletListComponent.svelte";
    import TokenListComponent from "$lib/Components/TokenListComponent.svelte";
    import TokenDataComponent from "$lib/Components/TokenDataComponent.svelte";

    const web3 = new Web3("https://bsc-dataseed1.binance.org/");
</script>

<div class="Wrapper CenterRowFlex">
    <div class="PrimarySubComponent">
        <WalletListComponent></WalletListComponent>
    </div>
    <div class="PrimarySubComponent">
        <TokenListComponent></TokenListComponent>
    </div>
    <div class="PrimarySubComponent">
        <TokenDataComponent></TokenDataComponent>
    </div>
</div>

<style>
    .PrimarySubComponent {
        flex: 1 0 0;
        height: 100%;
    }
</style>