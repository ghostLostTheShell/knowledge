#

## 配置 

1. 下载 repo 工具 & 配置

    ``` sh
    mkdir ~/bin
    PATH=~/bin:$PATH
    curl https://mirrors.tuna.tsinghua.edu.cn/git/git-repo -o repo
    chmod a+x ~/bin/repo
    ```

    配置 bashrc

    ```bash
    export REPO_URL='https://mirrors.tuna.tsinghua.edu.cn/git/git-repo'
    ```

1.  下载 AOSP


    ```bash
    wget -c https://mirrors.tuna.tsinghua.edu.cn/aosp-monthly/aosp-latest.tar # 下载初始化包
    tar xf aosp-latest.tar
    cd AOSP   # 解压得到的 AOSP 工程目录
    # 这时 ls 的话什么也看不到，因为只有一个隐藏的 .repo 目录
    repo sync # 正常同步一遍即可得到完整目录
    # 或 repo sync -l 仅checkout代码
    ```

## 创建工作目录 

```bash
mkdir WORKING_DIRECTORY
cd WORKING_DIRECTORY


##切换到 pixel 安卓 10 分支 
repo init -u https://mirrors.tuna.tsinghua.edu.cn/git/AOSP/platform/manifest -b android-10.0.0_r17
## 同步源码
repo sync

## 编译系统
source build/envsetup.sh
// 编译前删除build文件夹
make clobber
lunch aosp_sailfish-userdebug
#推荐使用 m
make -j16 



```
- 第三方依赖
https://developers.google.cn/android/drivers#sailfishqp1a.191005.007.a3

- 


>> https://source.android.google.cn/setup/start/build-numbers?hl=zh-cn 
