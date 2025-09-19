# electron-builder 打包
可以用来为 macos, linux, window 打包 

github: https://github.com/electron-userland/electron-builder

homepage: https://www.electron.build/

---
## 依赖安装

```bash

yarn add electron-builder --dev
// 或
npm i electron-builder --save-dev

```
---

## 打包配置

配置信息可以定义在:

* package.json

    把打包配置信息定义 build 中例如：
    ```json5
    "build": {
        "productName":"xxxx",//项目名 这也是生成的exe文件的前缀名
        "appId": "com.example.app",
        "copyright":"xxxx",//版权  信息
        "directories": { // 输出文件夹
            "output": "build"
        },

        // windows相关的配置
        "win": {  
            "icon": "xxx/icon.ico",//图标路径 
            "target": [
                {
                    "target": "nsis" //| "zip" //我们要的目标安装包
                }
            ]
        }
    }
    ```


* 通过命令行参数 --config ${filename}.[ yml | json5 |toml |js ]




## electron-builder 命令参数

* electron-builder
    直接执行生成一个exe 或 dmg 文件

* electron-builder --dir

    生成 package 目录但是没有打包为一个文件
* electron-builder --ia32 // 32位

* electron-builder        // 64位(默认)

### win 
