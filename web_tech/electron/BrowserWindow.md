# BrowserWindow
创建和控制浏览器窗口。

## 概念
- 无边框窗口
  无标题栏

- 父子窗口
child 窗口将总是显示在 top 窗口的顶部.
指定父窗口 `new BrowserWindow({ parent: top })`

## 窗口位置与尺寸
- win.maximize() 
  最大化
- win.minimize()
  最小化

- win.setFullScreen(true)
  设置全屏

- win.setBounds({ x: 440, y: 225, width: 800, height: 600 })
  设置尺寸及位置

## 发送事件

- 主进程：
  xxxWindow.webContents.send('main-process-messages', 'nihao');

- 渲染进程监听:
   ipcRenderer.on('main-process-messages', (event, arg) => {})