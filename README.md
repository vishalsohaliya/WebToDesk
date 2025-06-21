# WebToDesk

Original Doc > https://sameeradamith.github.io/webtodesk/

Convert your website to a native desktop application based on the Electron framework.

![WebToDesk Logo](./build/icon.png)

## Table of Contents

- [About](#about)
- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
- [Customization](#customization)
- [Building for Different Platforms](#building-for-different-platforms)
- [File Structure](#file-structure)
- [Contributing](#contributing)
- [Contact](#contact)

## About

WebToDesk is a powerful tool that allows you to convert your website into a native desktop application for macOS, Windows, and Linux. With WebToDesk, you can create a desktop app from your website within minutes, without the need to learn any programming language.

## Features

- Convert websites to desktop applications
- Support for macOS, Windows, and Linux
- Customizable menus (main and right-click)
- Ability to hide specific website elements
- Customizable application icons
- Local page support
- Electron-based for native feel and performance

## Getting Started

### Prerequisites

- Node.js (Latest version recommended)
- npm (Comes with Node.js)

### Installation

1. Clone the repository:

   ```
   git clone https://github.com/TerminalDZ/WebToDesk.git
   ```

2. Navigate to the project directory:

   ```
   cd WebToDesk
   ```

3. Install dependencies:
   ```
   npm install
   ```

## Usage

To run the application locally:

```
npm start
```

## Customization

### Changing the Application URL

Open `config.js` and modify the `websiteUrl` value:

```javascript
'websiteUrl': 'http://example.com',
```

### Changing the Application Name

1. In `package.json`, change the `name` attribute:

   ```json
   "name": "New_App_Name",
   ```

2. In `config.js`, modify the `appName` value:
   ```javascript
   'appName': 'WebToDesk',
   ```

### Customizing Window Size

In `config.js`, adjust the following values:

```javascript
'width': 800,
'height': 600,
'minWidth': 400,
'minHeight': 300,
```

### Changing Application Icons

Replace the icon files in the `build` folder:

- macOS: `icon.icns` or `icon.png` (at least 512x512)
- Windows: `icon.ico` or `icon.png` (at least 256x256)
- Linux: Icons will be generated based on the macOS icon or `icon.png`

### Customizing Menus

#### Main Menu

1. Link local pages to menu:
   First, create an HTML page in your app's `public` folder. Then, in `menu-config.js`, use the following format:

   ```javascript
   {label: 'Home', click: () => { require('./main')("home") }},
   {label: 'About', click: () => { require('./main')("about") }},
   ```

2. Add a new menu section:
   In `menu-config.js`, copy-paste the following code block and replace the values as needed:

   ```javascript
   {
     label: 'New_Menu_Name',
     submenu: [
       {role: 'reload'},
       {role: 'zoomIn'},
       {role: 'zoomOut'},
     ]
   },
   ```

3. Available Menu Roles:
   ```
   undo, redo, cut, copy, paste, pasteAndMatchStyle, delete, selectAll, reload, forceReload, toggleDevTools, resetZoom, zoomIn, zoomOut, togglefullscreen, window, minimize, close, help, about, services, hide, hideOthers, unhide, quit, startSpeaking, stopSpeaking, close, minimize, zoom, front, appMenu, fileMenu, editMenu, viewMenu, recentDocuments, toggleTabBar, selectNextTab
   ```

#### Right-Click Menu

To customize the right-click menu, navigate to the application root and edit `right-menu-config.js`.

### Hiding Website Elements

In `config.js`, add class or ID values to hide specific elements:

```javascript
'hideElementsId': ['id_1', 'id_2', 'id_3'],
'hideElementsClass': ['class_1', 'class_2', 'class_3'],
```

## Building for Different Platforms

Install electron-builder globally:

```
npm i electron-builder -g
```

Build for all platforms:

```
electron-builder -mwl
```

Build for specific platforms:

- macOS: `electron-builder --mac`
- Windows: `electron-builder --win`
- Linux: `electron-builder --linux`

**Note**: macOS users can build for all platforms. Windows users can only build for Windows and Linux.

## File Structure

- `node_modules/`: Dependencies
- `public/`: Images, stylesheets, and local web pages
- `build/`: Application icons
- `dist/`: Built package files and applications
- `config.js`: Main configuration file
- `package.json`: Node.js application and package details
- `menu-config.js`: Main menu template
- `right-menu-config.js`: Right-click menu configuration

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Contact

For any queries or support, please contact:

Email: boukemoucheidriss@gmail.com
