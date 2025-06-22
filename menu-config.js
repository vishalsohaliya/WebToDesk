module.exports = (options) => {
  const { menuConfig, navigateTo, showAboutDialog, checkForUpdates } = options;

// Function to map string actions from config to actual functions
  const mapAction = (item) => {
    // Pass through standard Electron roles and types
    if (item.role || item.type) return item;

    const newItem = { ...item }; // Create a copy to avoid modifying the original
    delete newItem.action;
    delete newItem.value;

    switch (item.action) {
      case "navigate":
        newItem.click = () => navigateTo(item.value);
        break;
      case "about":
        newItem.click = showAboutDialog;
        break;
      case "update":
        newItem.click = checkForUpdates;
        break;
      // Add other custom actions here if needed in the future
    }
    return newItem;
  };

  // Recursively build the menu from the configuration object
  const buildMenu = (submenu) => {
    return submenu.map((item) => {
      if (item.submenu) {
        return { ...item, submenu: buildMenu(item.submenu) };
      }
      return mapAction(item);
    });
  };

  return buildMenu(menuConfig || []);
};