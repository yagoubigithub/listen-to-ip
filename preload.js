// Copyright 2022-2023 eContriver, LLC
const {contextBridge, ipcRenderer} = require('electron');

contextBridge.exposeInMainWorld('electron', {

    close: ( ) => {
        ipcRenderer.send("close");
       
    }

})
    