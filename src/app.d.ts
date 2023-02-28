// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
    namespace App {
        // interface Error {}
        // interface Locals {}
        // interface PageData {}
        // interface Platform {}
    }

    interface Window {
        electronAPI: {
            copyToClipboard: (string) => Promise<undefined>,
            getUserDataDirPath: () => Promise<string>,
            readJsonFile: (string) => Promise<object | null>,
            readTextFile: (string) => Promise<string | null>,
            writeToFile: (string, string) => Promise<boolean>,
            hashAppPassword: (string) => Promise<string>,
            verifyAppPassword: (string, string) => Promise<boolean>
        };
    }
}

export {};
