<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import Loader from "./Loader.svelte";
    import { Web3Service } from "../Services/Web3Service";
    import { genericDataStore } from "../Stores/GenericDataStore";
    import { tokenListStore } from "../Stores/TokenListStore";

    let dispatch = createEventDispatcher();

    let walletId = $genericDataStore["popupParams"]["walletId"];
    let allTokens = $genericDataStore["popupParams"]["existingTokens"];
    let existingTokens = Object.keys(allTokens);
    let holderAddress = $genericDataStore["popupParams"]["holderAddress"];
    let networkType = $genericDataStore["popupParams"]["networkType"];

    let error: string | null = null;
    let showLoader = false;
    let clickTime = 0;
    let tokenAddress: string;
    let tokenName = "", tokenDecimals = 0, tokenSymbol = "", tokenBalance = 0, checksumAddress;

    let getTokenDetails = async () => {
        showLoader = true;
        if (clickTime === 0) {
            checksumAddress = Web3Service.getChecksumAddress(networkType, tokenAddress);
            if (checksumAddress) {
                let exists = false;
                for (let token of existingTokens) {
                    exists ||= (token === tokenAddress);
                }
                if (exists) {
                    error = "Token already imported";
                } else {
                    let tokenDetails = await Web3Service.getEvmErc20TokenDetails(networkType, tokenAddress, holderAddress);
                    if (tokenDetails == null) {
                        error = "Invalid Token Contract Address";
                    } else {
                        tokenName = tokenDetails.name;
                        tokenSymbol = tokenDetails.symbol;
                        tokenDecimals = tokenDetails.decimals;
                        tokenBalance = tokenDetails.amount;

                        clickTime = 1;
                    }
                }
            } else {
                error = "Input value is not an address";
            }
        } else if (clickTime === 1) {
            clickTime += 1;
            allTokens[checksumAddress] = {
                "contractAddress": checksumAddress,
                "name": tokenName,
                "symbol": tokenSymbol,
                "decimals": tokenDecimals,
                "amount": tokenBalance
            }
            $tokenListStore = allTokens;
            window.electronAPI.writeToFile(
                `${$genericDataStore["userDataPath"]}\\wallets\\` +
                `${walletId}\\${networkType}\\tokenDataList.json`,
                JSON.stringify(allTokens)
            ).then(() => {
                dispatch("closePopup");
            });
        }
        showLoader = false;
    };
</script>

<div class="CenterColumnFlex ImportTokenWrapper">
    <div class="CenterColumnFlex" style="width: 100%; height: 55%; justify-content: space-around;">
        <div class="CenterColumnFlex" style="width: 100%; text-align: center; font-size: 30px;">
            Token Contract Address:
        </div>

        <input bind:value={tokenAddress} placeholder="Token Address" type="text"/>

        <div style="height: 15px;"></div>
        <div style="height: 35px; color: #852000; text-align: center; font-size: 20px;">
            {#if error}
                {error}
            {/if}
        </div>
        <div style="height: 15px;"></div>

        <div class="CenterRowFlex" style="width: 100%; justify-content: space-evenly;">
            <div style="width: 20%; text-align: right;">Name:&nbsp;</div>
            <input value="{tokenName}" type="text" readonly>
            <div style="width: 15px;"></div>
        </div>
        <div style="height: 10px;"></div>
        <div class="CenterRowFlex" style="width: 100%; justify-content: space-evenly;">
            <div style="width: 20%; text-align: right;">Symbol:&nbsp;</div>
            <input value="{tokenSymbol}" type="text" readonly>
            <div style="width: 15px;"></div>
        </div>
        <div style="height: 10px;"></div>
        <div class="CenterRowFlex" style="width: 100%; justify-content: space-evenly;">
            <div style="width: 20%; text-align: right;">Decimals:&nbsp;</div>
            <input value="{tokenDecimals}" type="text" readonly>
            <div style="width: 15px;"></div>
        </div>
        <div style="height: 10px;"></div>
        <div class="CenterRowFlex" style="width: 100%; justify-content: space-evenly;">
            <div style="width: 20%; text-align: right;">Balance:&nbsp;</div>
            <input value="{(tokenBalance / (10 ** tokenDecimals)).toFixed(3)}" type="text" readonly>
            <div style="width: 15px;"></div>
        </div>
    </div>
    {#if showLoader}
        <Loader></Loader>
    {:else}
        <button on:click={getTokenDetails}>Confirm</button>
    {/if}
</div>

<style>
    .ImportTokenWrapper {
        width: 450px;
        height: 80%;

        border: 2px solid rgba(31, 30, 30, 0.80);
        border-radius: 10px;

        justify-content: space-around;
    }

    input, button {
        outline: none;
        border: none;

        border-radius: 10px;
    }

    input {
        width: 275px;
        height: 35px;
        font-size: 20px;

        box-sizing: border-box;
        padding: 5px 13px;
    }

    button {
        height: 50px;
        width: 150px;
        font-size: 30px;
    }

    input:active {
        outline: none;
    }

    select {
        outline: none;
        border: none;

        font-size: 25px;
    }
</style>