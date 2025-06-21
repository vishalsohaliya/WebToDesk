const { printPage } = require("./menu-helpers");

module.exports = (navigate) => [
  {
    label: "WebsiteToDesktop",
    submenu: [
      {
        label: "Home",
        click: () => navigate("home"),
      },
      {
        label: "About",
        click: () => navigate("about"),
      },
      { role: "quit" },
    ],
  },
  {
    label: "Edit",
    submenu: [
      { role: "undo" },
      { role: "redo" },
      { role: "cut" },
      { role: "copy" },
      { role: "paste" },
      { type: "separator" },
      { label: "Print", click: printPage },
    ],
  },
  {
    label: "View",
    submenu: [{ role: "reload" }, { role: "zoomIn" }, { role: "zoomOut" }],
  },
];
