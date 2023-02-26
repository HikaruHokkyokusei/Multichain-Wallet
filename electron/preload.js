const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    getUserDataDirPath: () => ipcRenderer.invoke('fileOperation:getUserDataDirPath')
})