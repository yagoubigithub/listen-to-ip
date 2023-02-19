const { app, BrowserWindow, screen, ipcMain , Tray  , dialog, Menu} = require("electron");
const path = require("path");
let win;
let tray = null
function createWindow() {
   win = new BrowserWindow({
    show: false,
    //  alwaysOnTop : true,
    frame: false,
    transparent: true,
    skipTaskbar: true,
    disableAutoHideCursor: true,

    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  win.loadFile("index.html");
  const display = screen.getPrimaryDisplay();
  
  if (process.platform == "darwin") {
    win.setResizable(true);
    win.setSize(display.bounds.width, display.bounds.height);
    win.setResizable(false);
    win.setPosition(display.bounds.x, display.bounds.y);
  //  win.setAlwaysOnTop(true, "main-menu", 1);
  } else {
   // win.setAlwaysOnTop(true, "screen");
    win.setSize(display.bounds.width, display.bounds.height);
    win.setPosition(display.bounds.x, display.bounds.y);
   // win.setVisibleOnAllWorkspaces(true);
    win.setFullScreenable(false);
  }

  const express = require("express");

  var http = require("http");

  let ex = express();

  let server = ex.listen(80, "0.0.0.0");

  ex.all("/trigger", function (req, res) {
    res.send("Server is ready!");
    win.maximize();

    win.show();
  });
}

app.whenReady().then(() => {
  createWindow();
  var myip = require('quick-local-ip');

//getting ip4 network address of local system
const ip = myip.getLocalIP4();
console.log("🚀 ~ file: main.js:57 ~ app.whenReady ~ ip", ip);



app.whenReady().then(() => {
   //set the icon tray for windows and mac
  //for mac should have 2 icons one 16x16 and other 32X32

  const iconName =
    process.platform === "win32" ? "windows-icon.png" : "iconTemplate.png";
  const iconPath = path.join(__dirname, `./image/${iconName}`);

  //initial the tray
  tray = new Tray(iconPath);

  //this toolTip is for when you hover the tray icon will show the title
  //I just take the title from index.html
  tray.setToolTip("Listen To IP");


  const contextMenu = Menu.buildFromTemplate([
    { label: 'Show Local IP address ', 
  
  click : ()=>{
    const options = {
      type: 'info',
      buttons: ['Cancel'],
      defaultId: 2,
      title: 'IP address',
      message: 'your IP address is : '+ ip,
      
      
    };
    const dummyWin = new BrowserWindow({
      show: false,
      alwaysOnTop: true,
      opacity  :0,
    });
  
    dialog.showMessageBox( dummyWin, options).then(((response, checkboxChecked) => {
      console.log("response");
       dummyWin.hide();
    }));
  }
  },
  { role: 'hide' ,label : "Hide"  },
  { type: 'separator' },
    { role: 'quit' ,label : "Quit"  }
   
  ])
  tray.setToolTip('This is my application.')
  tray.setContextMenu(contextMenu)
})



  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});


ipcMain.on("close" ,  ()=>{
    win.hide()
});