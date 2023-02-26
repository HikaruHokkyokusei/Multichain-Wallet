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
            getUserDataDirPath: () => Promise<string>,
            readJsonFile: (string) => Promise<object | null>
            writeToFile: (string, string) => Promise<boolean>
        };
    }
}

export {};
