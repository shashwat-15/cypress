/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
//# a stubbed out version of electron
//# for using in all of our tests :-)
module.exports = {
  shell: {},
  dialog: {},
  ipcMain: {
    on() {},
    removeAllListeners() {}
  },
  nativeImage: {
    createFromPath() { return {}; }
  },
  app: {
    on() {},
    exit() {},
    commandLine: {
      appendSwitch() {},
      appendArgument() {}
    },
    disableHardwareAcceleration() {}
  },
  systemPreferences: {
    isDarkMode() {},
    subscribeNotification() {}
  },
  BrowserWindow: {
    fromWebContents() {},
    getExtensions() {},
    removeExtension() {},
    addExtension() {}
  },
  Menu: {
    buildFromTemplate() {},
    setApplicationMenu() {}
  },
  Tray() { return {
    on() {},
    setToolTip() {},
    setImage() {},
    setPressedImage() {}
  }; }
};