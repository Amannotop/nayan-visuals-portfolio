const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const simpleGit = require('simple-git');

const PORTFOLIO_PATH = path.join(__dirname, '..', 'data', 'portfolio.json');
const REPO_DIR = path.join(__dirname, '..');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1000,
        height: 700,
        minWidth: 700,
        minHeight: 500,
        title: 'Nayan Visuals Admin',
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
        },
    });
    mainWindow.loadFile(path.join(__dirname, 'renderer', 'index.html'));
}

ipcMain.handle('load-portfolio', async () => {
    try {
        const data = fs.readFileSync(PORTFOLIO_PATH, 'utf-8');
        return { success: true, data: JSON.parse(data) };
    } catch (err) {
        return { success: false, error: err.message };
    }
});

ipcMain.handle('save-portfolio', async (_, entries) => {
    try {
        fs.writeFileSync(PORTFOLIO_PATH, JSON.stringify(entries, null, 4) + '\n');
        return { success: true };
    } catch (err) {
        return { success: false, error: err.message };
    }
});

ipcMain.handle('git-push', async (_, message) => {
    try {
        const git = simpleGit(REPO_DIR);
        await git.add('data/portfolio.json');
        await git.commit(message);
        const remotes = await git.getRemotes(true);
        for (const r of remotes) {
            await git.push(r.name, 'main');
        }
        return { success: true, remotes: remotes.map(r => r.name) };
    } catch (err) {
        return { success: false, error: err.message };
    }
});

app.whenReady().then(createWindow);
app.on('window-all-closed', () => app.quit());
