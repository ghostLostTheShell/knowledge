const { app, BrowserWindow, session } = require("electron");

const rootpath = "https://www.electronjs.org/docs/api/web-request";

const debug = /--debug/.test(process.argv[2]);

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 900,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  //载入html文件 使用 loadFile 或 loadURL（推荐）
  //win.loadFile('index.html')
  win.loadURL(rootpath);

  if (debug) {
    //打开dedug
    win.webContents.openDevTools();
  }
}

//拦截所有请求
const filter = {
  urls: ["*"],
}


app.whenReady().then(() => {

  session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {

      
      console.log("准备发送")
      callback(details)
    }
  )

  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    console.log("收到头回应")
    if(callback != null){
      callback(details)
    }

  })

  session.defaultSession.webRequest.onResponseStarted((details, callback) => {
    console.log("收到回应体")
    if(callback != null){
      callback(details)
    }
  })

  session.defaultSession.webRequest.onCompleted((details, callback) => {
    //嘤嘤嘤获取不到响应内容
    console.log("完成")

    if(callback != null){
      callback(details)
    }
  })

  createWindow()
})

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
