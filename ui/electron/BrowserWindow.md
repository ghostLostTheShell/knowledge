# BrowserWindow

用于呈现视图的

# 常用的功能


1. Electron去掉边框(标题栏)并设定可拖动

:: frame: false 关闭标题栏

let win = new BrowserWindow({width: 800, height: 600, `frame: false`})

:: 设置可拖动区域 
style=”-webkit-app-region: drag;” 用于设定该部分为可拖动区域；

style=”-webkit-app-region: no-drag;” 用于设定该部分为不可拖动区域；

```html
<header style="-webkit-app-region: drag">
    <section style="-webkit-app-region: no-drag">
        <!--html代码-->
    </section>
    <section>
        <!--html代码-->
    </section>
    <section style="-webkit-app-region: no-drag">
        <!--html代码-->
    </section>
</header>
```