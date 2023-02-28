import type { Writable } from "svelte/store";
import { writable } from "svelte/store";
import type { NetworkData } from "../Schemas/NetworkData";

export interface NetworkCollection {
    [walletId: string]: {
        [networkType: string]: NetworkData
    }
}

export const networkCollectionStore: Writable<NetworkCollection> = writable({});
