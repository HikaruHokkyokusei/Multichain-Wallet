"use strict";

const { app, BrowserWindow, ipcMain, clipboard } = require('electron');
const fs = require('fs');
const getDirName = require('path').dirname;
const crypto = require('crypto');

const appPasswordConfigs = {
    hashBytes: 64,
    saltBytes: 32,
    iterations: 1600000
};

const copyToClipboard = (event, text) => {
    clipboard.writeText(text);
};

const encryptWithAES256 = (event, data, password) => {
    const passMd5 = `${crypto.createHash('md5').update(password).digest("hex")}`;
    let iv = crypto.randomBytes(16);

    const cipher = crypto.createCipheriv('aes-256-cbc', passMd5, iv);
    let encryptedData = cipher.update(data, "utf-8", "hex");

    encryptedData += cipher.final("hex");
    iv = iv.toString("hex");

    return {
        "iv": iv,
        "data": encryptedData
    };
};

const decryptWithAES256 = (event, data, ivHex, password) => {
    const passMd5 = `${crypto.createHash('md5').update(password).digest("hex")}`;
    let iv = Buffer.from(ivHex, "hex");

    const decipher = crypto.createDecipheriv('aes-256-cbc', passMd5, iv);
    let decryptedData = decipher.update(data, "hex", "utf-8");

    try {
        decryptedData += decipher.final("utf8");
    } catch {
        decryptedData = null;
    }

    return decryptedData;
};

const hashAppPassword = (event, password) => {
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
const verifyAppPassword = (event, password, storedHash) => {
    storedHash = Buffer.from(storedHash, "hex");
    let saltBytes = storedHash.readUInt32BE(0);
    let hashBytes = storedHash.length - saltBytes - 8;
    let iterations = storedHash.readUInt32BE(4);
    let salt = storedHash.subarray(8, saltBytes + 8);
    let hash = storedHash.toString('binary', saltBytes + 8);

    let verify = crypto.pbkdf2Sync(password, salt, iterations, hashBytes, 'sha512');
    return verify.toString('binary') === hash;
};

const getUserDataDirPath = () => {
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
const writeToFile = (event, filePath, fileData) => {
    try {
        let path = getDirName(filePath);
        fs.mkdirSync(path, { recursive: true });
        fs.writeFileSync(filePath, fileData, { flag: "w" });
        return true;
    } catch (err) {
        console.log(err);
        return false;
    }
};

const createWindow = () => {
    const mainWindow = new BrowserWindow({
        minWidth: 1000,
        minHeight: 800,
        width: 1000,
        height: 800,
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
    ipcMain.handle('crypto:encryptWithAES256', encryptWithAES256);
    ipcMain.handle('crypto:decryptWithAES256', decryptWithAES256);

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
