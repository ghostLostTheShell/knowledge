```bash
mkdir android-kernel && cd android-kernel

repo init -u https://mirrors.tuna.tsinghua.edu.cn/git/AOSP/kernel/manifest -b android-msm-marlin-3.18-pie-qpr2

repo sync

build/build.sh
```


## 错误处理

- python: can't open file 'build/buildinfo/buildinfo.py': [Errno 2] No such file or directory

  <b>原因：</b>
  
  文件丢失，但是不知道这个文件是为什么会丢失。

  <b>解决方法:</b>

    去掉 ./build.config 文件的EXTRA_CMDS='python build/buildinfo/buildinfo.py'

## 参考

  - https://www.jianshu.com/p/a51f4b9e8d221

  - <del>https://source.android.google.cn/source/building-kernels?hl=zh-cn</del>
  - https://source.android.google.cn/source/building-kernels?hl=zh-cn

  - https://source.android.google.cn/setup/build/building-kernels?hl=zh-cn