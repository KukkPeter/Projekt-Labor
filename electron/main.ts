import { app, BrowserWindow } from 'electron';
import * as path from 'path';
import {Router} from "./router";

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 1200,
    minHeight: 800,
    title: 'Family Tree',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  win.setMenu(null);

  win.webContents.openDevTools();

  win.loadFile('../frontend/dist/index.html');

  return win;
}

app.whenReady().then(() => {
  let browserWindow = createWindow();

  new Router(browserWindow);

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});