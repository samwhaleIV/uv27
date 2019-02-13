const {
    app,
    BrowserWindow
} = require("electron");

let window;

function createWindow() {
    window = new BrowserWindow({
        width: 750,
        height: 650,
        nodeIntegration: true,
        backgroundColor: "#000000",
        backgroundThrottling: false,
        show: false
    });
    //window.webContents.openDevTools();
    window.setMenu(null);
    window.loadFile("index.html");
    window.on("closed",() => {
        window = null;
    });
    window.once("ready-to-show",() => {
        window.show();
    });
}

app.on("ready",createWindow);

app.on("window-all-closed",() => {
    if(process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate",() => {
    if(win === null) {
        createWindow()
    }
});
