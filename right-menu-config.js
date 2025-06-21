const { printPage } = require("./menu-helpers");

module.exports = [
  { role: "reload" },
  { role: "cut" },
  { role: "copy" },
  { role: "paste" },
  { role: "undo" },
  { role: "redo" },
  { type: "separator" },
  { label: "Print", click: printPage },
];
