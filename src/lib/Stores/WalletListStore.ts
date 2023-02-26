import type { Writable } from "svelte/store";
import { writable } from "svelte/store";
import type { WalletData } from "../Schemas/WalletData";

export const walletListStore: Writable<WalletData[]> = writable([]);