const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  loadPortfolio: () => ipcRenderer.invoke('load-portfolio'),
  savePortfolio: (data) => ipcRenderer.invoke('save-portfolio', data),
  gitPush: (message) => ipcRenderer.invoke('git-push', message),
  confirm: (opts) => ipcRenderer.invoke('confirm-dialog', opts),
  onMenuNew: (fn) => ipcRenderer.on('menu-new', fn),
  onMenuSave: (fn) => ipcRenderer.on('menu-save', fn),
  onMenuPush: (fn) => ipcRenderer.on('menu-push', fn),
});
