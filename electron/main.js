"use strict";

const { app, BrowserWindow, ipcMain } = require('electron');
const fs = require('fs');

const getUserDataDirPath = async () => {
    return app.getPath('userData');
};

const readJsonFile = async (event, filePath) => {
    try {
        return JSON.parse("" + await fs.readFileSync(filePath));
    } catch (err) {
        console.log(err);
        return null;
    }
};

const writeToFile = async (event, filePath, fileData) => {
    try {
        await fs.writeFileSync(filePath, fileData, { flag: "w" });
        return true;
    } catch (err) {
        console.log(err);
        return false;
    }
};

const createWindow = () => {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: `${__dirname}/preload.js`
        }
    });

    mainWindow.loadFile(`${__dirname}/../build/index.html`).then();
};

app.whenReady().then(() => {
    ipcMain.handle('fileOperation:getUserDataDirPath', getUserDataDirPath);
    ipcMain.handle('fileOperation:readJsonFile', readJsonFile);
    ipcMain.handle('fileOperation:writeToFile', writeToFile);

    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process["platform"] !== 'darwin') {
        app.quit();
    }
});
