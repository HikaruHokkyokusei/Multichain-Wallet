import type { Writable } from "svelte/store";
import { writable } from "svelte/store";
import type { NetworkData } from "../Schemas/NetworkData";

export const networkListStore: Writable<{ [walletId: string]: NetworkData[] }> = writable({});