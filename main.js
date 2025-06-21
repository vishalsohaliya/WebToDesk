
const {
  app,
  BrowserWindow,
  nativeTheme,
  ipcMain,
  Menu,
  dialog,
} = require("electron");
const path = require("path");
const createMainMenu = require("./menu-config");
const rightMenuTemplate = require("./right-menu-config");
const printOptions = require("./print-options.js");
const appConfig = require("./config");

let mainWindow;

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  // If we don't get the lock, another instance is already running.
  // Quit this new instance.
  app.quit();
} else {
  // This is the primary instance.
  app.on("second-instance", (event, commandLine, workingDirectory) => {
    // Someone tried to run a second instance. We should focus our window.
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });

  // Continue with app initialization.
// Navigation function to be passed to the menu template
function navigateTo(pageId) {
  if (pageId === "home") {
    loadWebContent();
  } else {
    mainWindow.loadFile(path.join(__dirname, `public/${pageId}.html`));
  }
}

// Menu
const mainMenu = Menu.buildFromTemplate(createMainMenu(navigateTo));
const rightMenu = Menu.buildFromTemplate(rightMenuTemplate);

function createWindow() {
  mainWindow = new BrowserWindow({
    width: appConfig["width"],
    height: appConfig["height"],
    minWidth: appConfig["minWidth"],
    minHeight: appConfig["minHeight"],
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      // Security Best Practices:
      contextIsolation: true, // Isolate renderer context from preload
      nodeIntegration: false, // Do not expose Node.js APIs to the renderer
    },
  });

  //Load Appliaction Main Menu
  Menu.setApplicationMenu(mainMenu);

  //Load Right click menu
  mainWindow.webContents.on("context-menu", () => {
    rightMenu.popup(mainWindow);
  });

  //CreatWindow execute loding remote content
  loadWebContent();
}

function loadWebContent() {
  // Loading splash screen
  mainWindow.loadFile(path.join(__dirname, "public/loading.html"));

  // Create webContents
  const wc = mainWindow.webContents;

  // Successful loading page after dom created
  wc.once("did-finish-load", () => {
    mainWindow.loadURL(appConfig["websiteUrl"]);
  });

  // If not loading page, redirect to error page
  wc.on("did-fail-provisional-load", (error, code) => {
    mainWindow.loadFile(path.join(__dirname, "public/offline.html"));
  });
}

// Check website loading error (offline, page not found or etc.)
ipcMain.on("online-status-changed", (event, status) => {
  if (status === true) {
    loadWebContent();
  }
});

// Print page option
ipcMain.on("printPage", () => {
  const win = BrowserWindow.getFocusedWindow();
  if (!win) return;

  win.webContents.print(printOptions, (success, failureReason) => {
    if (!success) {
      dialog.showMessageBox(mainWindow, {
        message: failureReason.charAt(0).toUpperCase() + failureReason.slice(1),
        type: "error",
        buttons: ["Cancel"],
        defaultId: 0,
        title: "Print Error",
      });
    }
  });
});

  app.whenReady().then(createWindow);

  // Quit when all windows are closed.
  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
      app.quit();
    }
  });

  app.on("activate", () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
}
