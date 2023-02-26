import type { Writable } from "svelte/store";
import { writable } from "svelte/store";

interface GenericData {
    "userDataPath"?: string,
    appPasswordHash?: string,
    isAppLocked?: boolean
}

export const genericDataStore: Writable<GenericData> = writable({});
