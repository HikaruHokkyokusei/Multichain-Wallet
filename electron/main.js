"use strict";

const { app, BrowserWindow, ipcMain, dialog } = require('electron');

const getUserDataDirPath = async () => {
  return app.getPath('userData');
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
