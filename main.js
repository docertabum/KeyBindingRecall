const { app, BrowserWindow } = require('electron');
const windowService = require('./services/windowService');
const appDetectionService = require('./services/appDetectionService');

app.whenReady().then(() => {
  windowService.createWindow();
  appDetectionService.startDetection();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    windowService.createWindow();
  }
});
