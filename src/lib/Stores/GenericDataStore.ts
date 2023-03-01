import type { Writable } from "svelte/store";
import { writable } from "svelte/store";

interface GenericData {
    "userDataPath"?: string,
    appPasswordHash?: string,
    isAppLocked?: boolean,
    showPopup?: boolean,
    popupType?: string,
    popupParams?: any,
    selectedWalletIndex?: number,
    selectedNetworkType?: string
    selectedTokenAddress?: string
}

export const genericDataStore: Writable<GenericData> = writable({
    isAppLocked: true,
    showPopup: false
});
