"use strict";

const { app, BrowserWindow, ipcMain, clipboard } = require('electron');
const fs = require('fs');
const crypto = require('crypto');

const appPasswordConfigs = {
    hashBytes: 64,
    saltBytes: 32,
    iterations: 1600000
};

const copyToClipboard = (event, text) => {
    clipboard.writeText(text);
};

const hashAppPassword = async (event, password) => {
    let salt = crypto.randomBytes(appPasswordConfigs["saltBytes"]);
    let hash = crypto.pbkdf2Sync(
        password,
        salt,
        appPasswordConfigs["iterations"],
        appPasswordConfigs["hashBytes"],
        'sha512'
    );

    let combined = new Buffer(hash.length + salt.length + 8);
    combined.writeUInt32BE(salt.length, 0);
    combined.writeUInt32BE(appPasswordConfigs["iterations"], 4);

    salt.copy(combined, 8);
    hash.copy(combined, salt.length + 8);

    return combined.toString("hex");
};
const verifyAppPassword = async (event, password, storedHash) => {
    storedHash = Buffer.from(storedHash, "hex");
    let saltBytes = storedHash.readUInt32BE(0);
    let hashBytes = storedHash.length - saltBytes - 8;
    let iterations = storedHash.readUInt32BE(4);
    let salt = storedHash.subarray(8, saltBytes + 8);
    let hash = storedHash.toString('binary', saltBytes + 8);

    let verify = crypto.pbkdf2Sync(password, salt, iterations, hashBytes, 'sha512');
    return verify.toString('binary') === hash;
};

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
const readTextFile = async (event, filePath) => {
    try {
        return `${await fs.readFileSync(filePath)}`;
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
    ipcMain.handle('clipboard:copyToClipboard', copyToClipboard);
    ipcMain.handle('fileOperation:getUserDataDirPath', getUserDataDirPath);
    ipcMain.handle('fileOperation:readJsonFile', readJsonFile);
    ipcMain.handle('fileOperation:readTextFile', readTextFile);
    ipcMain.handle('fileOperation:writeToFile', writeToFile);
    ipcMain.handle('appPassword:hash', hashAppPassword);
    ipcMain.handle('appPassword:verify', verifyAppPassword);

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
