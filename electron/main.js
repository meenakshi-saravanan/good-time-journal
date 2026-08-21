const { app, BrowserWindow } = require("electron");
const path = require("path");

let mainWindow;
let server;

async function createWindow() {
  try {
    // Start Express server
    const backend = require("../server");
    server = await backend.startServer();

    // Create Electron window
    mainWindow = new BrowserWindow({
      width: 1200,
      height: 800,
      minWidth: 900,
      minHeight: 600,

      webPreferences: {
        preload: path.join(__dirname, "preload.js"),
        contextIsolation: true,
        nodeIntegration: false,
      },
    });

    // Load your existing Express application
    await mainWindow.loadURL(
      `http://${backend.HOST}:${backend.PORT}`
    );

    mainWindow.on("closed", () => {
      mainWindow = null;
    });
  } catch (error) {
    console.error("Failed to start application:", error);
    app.quit();
  }
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("before-quit", () => {
  if (server) {
    server.close();
  }
});