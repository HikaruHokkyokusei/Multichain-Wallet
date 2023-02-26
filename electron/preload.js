const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    getUserDataDirPath: () => ipcRenderer.invoke('fileOperation:getUserDataDirPath'),
    readJsonFile: (filePath) => ipcRenderer.invoke('fileOperation:readJsonFile', filePath),
    readTextFile: (filePath) => ipcRenderer.invoke('fileOperation:readTextFile', filePath),
    writeToFile: (filePath, fileData) => ipcRenderer.invoke('fileOperation:writeToFile', filePath, fileData)
});
