const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    loadPortfolio: () => ipcRenderer.invoke('load-portfolio'),
    savePortfolio: (data) => ipcRenderer.invoke('save-portfolio', data),
    gitPush: (message) => ipcRenderer.invoke('git-push', message),
});
