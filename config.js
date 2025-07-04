
const config = {
  // Main Application URL
  websiteUrl: "https://ignou.samarth.edu.in/index.php/site/login",

  // Application Name
  appName: "WebsiteToDesktop",

  // Application Version
  appVersion: "1.0.0",

  // Application Description (for About dialog)
  appDescription: "A powerful tool to convert your website into a native desktop application.",

  // Path to the app icon (relative to the executable)
  appIcon: "public/icons/icon.png",

  // Application window width and height
  width: 1280,
  height: 800,
  minWidth: 1280,
  minHeight: 800,

  // Hide elements by ID
  hideElementsId: [],

  // Hide elements by Class
  hideElementsClass: [],

  // Default menu structure
  menu: [
    {
      "label": "&App",
      "submenu": [
        {
          "label": "Home",
          "action": "navigate",
          "value": "home"
        },
        {
          "label": "About",
          "action": "navigate",
          "value": "about.html"
        },
        {
          "type": "separator"
        },
        {
          "role": "quit"
        }
      ]
    },
    {
      "label": "&Edit",
      "submenu": [
        { "role": "undo" },
        { "role": "redo" },
        { "type": "separator" },
        { "role": "cut" },
        { "role": "copy" },
        { "role": "paste" }
      ]
    },
    {
      "label": "&View",
      "submenu": [
        { "role": "reload" },
        { "role": "zoomIn" },
        { "role": "zoomOut" },
        { "role": "resetZoom" }
      ]
    },
    {
      "label": "&Help",
      "submenu": [
        {
          "label": "Check for Updates",
          "action": "update"
        },
        { "label": "About", "action": "about" }
      ]
    }
  ]
};


module.exports = config;
