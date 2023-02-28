import type { TokenData } from "../Schemas/TokenData";
import type { Writable } from "svelte/store";
import { writable } from "svelte/store";

export const tokenListStore: Writable<TokenData[]> = writable([]);