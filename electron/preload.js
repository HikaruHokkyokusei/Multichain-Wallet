const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    copyToClipboard: (text) => ipcRenderer.invoke('clipboard:copyToClipboard', text),
    getUserDataDirPath: () => ipcRenderer.invoke('fileOperation:getUserDataDirPath'),
    readJsonFile: (filePath) => ipcRenderer.invoke('fileOperation:readJsonFile', filePath),
    readTextFile: (filePath) => ipcRenderer.invoke('fileOperation:readTextFile', filePath),
    writeToFile: (filePath, fileData) => ipcRenderer.invoke('fileOperation:writeToFile', filePath, fileData),
    hashAppPassword: (password) => ipcRenderer.invoke('appPassword:hash', password),
    verifyAppPassword: (password, storedHash) => ipcRenderer.invoke('appPassword:verify', password, storedHash)
});
