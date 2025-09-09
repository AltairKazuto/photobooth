const { app, BrowserWindow } = require('electron');

function createWindow() {
    const win = new BrowserWindow({
        width: 1280,
        height: 800,
        webPreferences: {
            // devTools: false, // Disable DevTools
            nodeIntegration: true, // Enable Node.js integration in the renderer process
            contextIsolation: false // Disable context isolation for simplicity in development
        },
    });

    win.loadURL('http://localhost:3000'); // Load your React app's development server
    win.webContents.openDevTools(); // Open DevTools for debugging
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});