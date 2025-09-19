
## 环境变量

- `ARCH`

- `CROSS_COMPILE`

## 参数

- `ARCH=${?}`

即architecture,就是选择编译哪一种cpu architecture，也就是编译arch/目录下的哪一个子目录。如指定make ARCH=arm就是编译arch/arm下的代码。如果不指定，make将使用本机（用什么机器编译就是什么）的cpu作为缺省ARCH.注意：arch/arm下不但有arm体系架构特有的代码，还有arm特有的kconfig,也就是配置选项，所以在make menuconfig，make xxxx_defconfig的时候也必须指定ARCH＝arm。

- `CROSS_COMPILE=${?}`

即交叉编译器的前缀（prefix)，也就是选择将代码编译成目标cpu的指令的工具，如指定make CROSS_COMPILE=arm-none-linux-gnueabi-就是使用arm-none-linux-gnueabi-gcc, arm-none-linux-gnueabi-ld等工具将代码编译成arm的可执行指令。如果不指定CROSS_COMPILE参数，make时将认为prefix为空，即使用gcc来编译。这里cross_compile的设置，是假定所用的交叉工具链的gcc程序名称为arm-linux-gcc。如果实际使用的gcc名称是some-thing-else-gcc，则这里照葫芦画瓢填some-thing-else-即可。总之，要省去名称中最后的gcc那3个字母。

- `-f ${filename}`

显式地指定文件作为Makefile

- `-C ${dirname}`

设置make在开始运行后的工作目录为dirname

- `-e`

不允许在Makefile中替换环境变量的赋值


- `-j  ${n}`

指同时运行命令的个数



## 

- .PHONY

在Makefile中，.PHONY后面的target表示的也是一个伪造的target, 而不是真实存在的文件target，注意Makefile的target默认是文件。