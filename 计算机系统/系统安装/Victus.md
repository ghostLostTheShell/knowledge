## GTX 1660 驱动安装

/**/禁用nouveau驱动


``` file--: /etc/modprobe.d/blacklist.conf
  lacklist nouveau
  blacklist lbm-nouveau
  options nouveau modeset=0
  alias nouveau off
  alias lbm-nouveau off
 ```

 echo options nouveau modeset=0 | sudo tee -a /etc/modprobe.d/nouveau-kms.conf


 update-initramfs -u

reboot

---
lsmod | grep nouveau


没有信息显示，说明nouveau已被禁用，接下来可以安装nvidia的显卡驱动。
---

1. 

  apt-get install build-essentials

  apt-get install linux-headers-$(uname -r)

  apt-get install linux-source


2. 
到官网现在驱动

3. 签名导入

  mokutil --import my_signing_key_pub.der






参考：

1. 

  https://linuxconfig.org/how-to-install-nvidia-driver-on-debian-10-buster-linux

2. https://blog.csdn.net/qq_37146516/article/details/83755441




  
## AMD驱动程序

1. apt update

2.  apt install firmware-linux firmware-linux-nonfree libdrm-amdgpu1 xserver-xorg-video-amdgp



>> 参考：

https://linuxconfig.org/how-to-install-the-latest-amd-drivers-on-debian-10-buster



---尝试

apt -t buster-backports install nvidia-driver



------
https://www.cnblogs.com/pipci/p/12589355.html