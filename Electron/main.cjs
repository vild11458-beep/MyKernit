const { app, BrowserWindow, Menu, protocol } = require('electron');
const path = require('path');
const fs = require('fs');

// Simple check for dev mode instead of electron-is-dev
const isDev = !app.isPackaged;

// Register app:// protocol as privileged (needed before app ready)
if (!isDev) {
  protocol.registerSchemesAsPrivileged([
    { scheme: 'app', privileges: { standard: true, secure: true, supportFetchAPI: true } }
  ]);
}

let mainWindow;

function createWindow() {
  // Get screen dimensions
  const { screen } = require('electron');
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width: screenWidth, height: screenHeight } = primaryDisplay.workAreaSize;
  
  // Calculate optimal window size (80% of screen, but not larger than 1600x1000)
  const windowWidth = Math.min(Math.floor(screenWidth * 0.8), 1600);
  const windowHeight = Math.min(Math.floor(screenHeight * 0.85), 1000);
  
  mainWindow = new BrowserWindow({
    width: windowWidth,
    height: windowHeight,
    minWidth: 800,
    minHeight: 600,
    center: true, // Center the window on screen
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
    },
    icon: path.join(__dirname, '../assets/icon.png'),
  });

  const startUrl = isDev 
    ? 'http://localhost:5173' 
    : 'app://./index.html';
  
  mainWindow.loadURL(startUrl);

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', () => {
  // Set app user data path for proper storage
  if (!isDev) {
    const userDataPath = path.join(app.getPath('userData'), 'MyKernit');
    app.setPath('userData', userDataPath);
    
    // Register app:// protocol for proper file serving
    protocol.registerFileProtocol('app', (request, callback) => {
      const url = request.url.substring(6); // Remove 'app://'
      const filePath = path.normalize(path.join(__dirname, '../dist-web', url));
      callback({ path: filePath });
    });
  }
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// Handle any uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});
