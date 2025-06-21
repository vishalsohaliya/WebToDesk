const { contextBridge, ipcRenderer } = require("electron");
const appConfig = require("./config"); // This is okay as it's static config

// Expose a secure API to the renderer process
contextBridge.exposeInMainWorld("api", {
  // Function to send messages from renderer to main
  send: (channel, data) => {
    // Whitelist channels for security
    const validChannels = ["online-status-changed"];
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },
});

window.addEventListener("DOMContentLoaded", () => {
  // Hide webpage elements using ID tags
  if (appConfig.hideElementsId.length > 0) {
    appConfig.hideElementsId.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        element.style.display = "none";
      }
    });
  }

  // Hide webpage elements using Class tags
  if (appConfig.hideElementsClass.length > 0) {
    appConfig.hideElementsClass.forEach((className) => {
      const elements = document.getElementsByClassName(className);
      // HTMLCollection is live, so iterate over a static copy
      Array.from(elements).forEach((element) => {
        element.style.display = "none";
      });
    });
  }

  // Change application title
  document.title = appConfig["appName"];

  // Error page reload button press
  const tryAgainBtn = document.getElementById("tryagain");
  if (tryAgainBtn) {
    // Use the new secure API to communicate with the main process
    tryAgainBtn.onclick = () => window.api.send("online-status-changed", true);
  }
});
