#

## 删除包

* pacman -R 包名：该命令将只删除包，保留其全部已经安装的依赖关系

* pacman -Rs 包名：在删除包的同时，删除其所有没有被其他已安装软件包使用的依赖关系

* pacman -Rsc 包名：在删除包的同时，删除所有依赖这个软件包的程序

* pacman -Rd 包名：在删除包时不检查依赖。

## 安装包

* pacman -S 包名：例如，执行 pacman -S firefox 将安装 Firefox。你也可以同时安装多个包

## 搜索包

* pacman -Ss 关键字：在仓库中搜索含关键字的包。

* pacman -Qs 关键字： 搜索已安装的包。

* pacman -Qi 包名：查看有关包的详尽信息。

* pacman -Ql 包名：列出该包的文件。
