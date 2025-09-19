#

## 安装

### 离线安装

#### 下载离线安装包

>https://docs.microsoft.com/en-us/windows/wsl/install-manual

#### 安装WSL

1. 首先以管理员身份打开PowerShell并运行：

>>``` powershell
>>Enable-WindowsOptionalFeature -Online -FeatureName  Microsoft-Windows-Subsystem-Linux
>>```

2. 将下载的linux包的后缀由.Appx改为.zip，并解压.

3. 打开cmd，输入

>>``` powershell
>>LxRunOffline i -n ${安装名称} -d ${安装路径} -f ${安装文件}
>>```

>node 若系统中安装不止一个WSL,则可以通过
> `LxRunOffline sd -n ${安装名称}` 设置默认启动系统，

4. 启动命令

>>``` powershell
>>wsl
>>```
>node: `LxRunOffline list` 可以查看安装的 wsl 的名称
