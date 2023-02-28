import type { Writable } from "svelte/store";
import { writable } from "svelte/store";

interface GenericData {
    "userDataPath"?: string,
    appPasswordHash?: string,
    isAppLocked?: boolean,
    showPopup?: boolean,
    selectedWalletIndex?: number,
    selectedNetworkIndex?: number
}

export const genericDataStore: Writable<GenericData> = writable({
    isAppLocked: true,
    showPopup: false
});
