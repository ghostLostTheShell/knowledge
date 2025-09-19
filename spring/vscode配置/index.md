# 配置

## 添加启动测试

在项目的目录添加 `.vscode/launch.json` 文件,在文件中添加以下内容

```json
{
  "configurations": [
    {

      "type": "java",

      "name": "Debug XptninmsApplication by jun",

      "request": "launch",

      "cwd": "${workspaceFolder}",

      "console": "internalConsole",

      "mainClass": "com.scodeno.xptninms.XptninmsApplication",

      "args": "--spring.profiles.active=jun",

      "projectName": "xptninms-manage-platform"

    }
  ]
}
```

`args`: 为启动时的参数
