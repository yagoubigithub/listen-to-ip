const { app, BrowserWindow, screen, ipcMain , Tray  , dialog, Menu} = require("electron");
const path = require("path");
const express = require("express");
const kill = require('kill-port')


let ex = express();

let win;
let tray = null
function createWindow() {
   win = new BrowserWindow({
    show: false,
    //  alwaysOnTop : true,
   // opacity  : 0.5,
   backgroundColor :  "rgba(0,0,0,0.3)",
    frame: false,
    transparent: true,
    skipTaskbar: true,
    height : 600,
    width : 800,
    disableAutoHideCursor: true,

    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  win.loadFile("index.html");
  win.hide();
  // const display = screen.getPrimaryDisplay();
  
  // if (process.platform == "darwin") {
  //   win.setResizable(true);
  //   win.setSize(display.bounds.width, display.bounds.height);
  //   win.setResizable(false);
  //   win.setPosition(display.bounds.x, display.bounds.y);
  // //  win.setAlwaysOnTop(true, "main-menu", 1);
  // } else {
  //  // win.setAlwaysOnTop(true, "screen");
  //   win.setSize(display.bounds.width, display.bounds.height);
  //   win.setPosition(display.bounds.x, display.bounds.y);
  //  // win.setVisibleOnAllWorkspaces(true);
  //   win.setFullScreenable(false);
  // }
 
  let server = ex.listen(8080);

  ex.all("/trigger", function (req, res) {
    win.show();
    win.setAlwaysOnTop(true)
    win.focus();
    //win.maximize();
    win.setAlwaysOnTop(false)
    res.send("Server is ready!");


    setTimeout(()=>{

      win.hide();
    } , 10000);
  

   
  });


  // const port = 80;
  // kill(port, 'tcp')
  // .then((re)=>{
  //   // let server = ex.listen(80, "0.0.0.0");

  //   // ex.all("/trigger", function (req, res) {
  //   //   res.send("Server is ready!");
  //   //   win.maximize();
  
  //   //   win.show();
  //   // });
  //   console.log(re)
  // })
  // .catch(console.log)


 

 
}

app.whenReady().then(() => {
  createWindow();

// //getting ip4 network address of local system
// const ip = require('ip').address() // my ip address;
// console.log("🚀 ~ file: main.js:57 ~ app.whenReady ~ ip", ip);



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