const { ipcMain } = require("electron");

// Shared method to trigger the print dialog via an IPC event
function printPage() {
  ipcMain.emit("printPage");
}

module.exports = { printPage };