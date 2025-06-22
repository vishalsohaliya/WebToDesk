
const {
  app,
  BrowserWindow,
  nativeTheme,
  ipcMain,
  Menu,
  dialog,
} = require("electron");
const fs = require("fs");
const path = require("path");
const createMainMenu = require("./menu-config");
const rightMenuTemplate = require("./right-menu-config");
const printOptions = require("./print-options.js");

// --- Dynamic Configuration Loading ---
const defaultConfig = require("./config"); // Internal fallback config

// Determine the base path. In development, it's the project root.
// When packaged, it's the directory where the executable is.
const basePath = app.isPackaged
  ? path.dirname(app.getPath("exe"))
  : app.getAppPath();

let appConfig;
try {
  // Try to read the external config file that clients will edit
  const externalConfigPath = path.join(basePath, "config.json");
  const externalConfigStr = fs.readFileSync(externalConfigPath, "utf8");
  const externalConfig = JSON.parse(externalConfigStr);
  // Merge with default to ensure all keys are present
  appConfig = { ...defaultConfig, ...externalConfig };
} catch (error) {
  // If reading/parsing fails (e.g., file not found), use the internal default config
  console.log("Could not load external config.json, using default. Error:", error.message);
  appConfig = defaultConfig;
}


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

  // Dialog for "About" menu item
  function showAboutDialog() {
    dialog.showMessageBox(mainWindow, {
      type: "info",
      title: `About ${appConfig.appName}`,
      message: `${appConfig.appName} - Version ${appConfig.appVersion}`,
      detail: appConfig.appDescription,
      buttons: ["OK"],
      // For a better UI, you can add an icon.
      // Ensure you have an icon file at this path.
      icon: path.join(basePath, appConfig.appIcon),
    });
  }

  // Dialog for "Check for Updates" menu item
  function checkForUpdates() {
    dialog.showMessageBox(mainWindow, {
      type: "info",
      title: "Check for Updates",
      message: "You are on the latest version.",
      detail: `${appConfig.appName} ${appConfig.appVersion}`,
      buttons: ["OK"],
    });
  }

  // Continue with app initialization.
// Navigation function to be passed to the menu template
function navigateTo(pageId) {
  if (pageId === "home") {
    loadWebContent();
  } else {
    // Load custom pages from the external public folder
    const customPagePath = path.join(basePath, "public", pageId);
    mainWindow.loadFile(customPagePath);
  }
}

// Menu
const mainMenu = Menu.buildFromTemplate(
  createMainMenu({
      menuConfig: appConfig.menu, // Pass the entire menu structure
    navigateTo,
    showAboutDialog,
    checkForUpdates,
  })
);
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
