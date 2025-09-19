## 下载uboot源码
  
http://www.denx.de/wiki/U-Boot/SourceCode

## 配置交叉编译环境

`gnu gcc compiler 下载地址`

```
https://snapshots.linaro.org/gnu-toolchain/10.2-2021.02-1/aarch64-linux-gnu/
```

## 创建创建boot分区

  rpi4的启动分区为 FAT32
   FAT32 


## 编译 uboot

切换到 
```
make distclean
make rpi_4_defconfig
make -j
```

##修改config.txt文件
arm_control=0x200 #表示允许64程序
enable_uart=1 //使能串口
arm_64bit=1
kernel=u-boot.bin