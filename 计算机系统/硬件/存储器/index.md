#


* norflash - 是非易失性存储器（也就是掉电保存）

  NOR flash带有SRAM接口，有足够的的地址引脚进行寻址，可以很容易地读取其内部的每一个字节（注意是 Read ！因为flash不是任意写入，而是遵循 disable write protect -> erase -> write 。这是flash的特性决定的，其电路只能从 1->0，而不能 0->1翻转。擦除过程就是将flash中的某一个扇区恢复为 0xFFFFFFFF，然后再写入数据。另外，代码指令可以直接在norflash上运行。

  （重要！！！上电后可以读取norflash中的数据但是不可以进行写操作）

* nandflash - 是非易失性存储器（也就是掉电保存）

  它也是非易失闪存（掉电不丢失）的一种，但是它虽然有数据总线，但是没有地址总线，所以cpu不能直接从nandflash中取指运行，由于它价格便宜，所以常常用来存储大量数据，和我们常说的硬盘类似。

* SRAM - 静态随机访问存储器 - Static Random Access Memory

  static 是指只要不掉电，存储在SRAM中的数据就不会丢失。这一点与DRAM不同，DRAM需要进行周期性刷新操作。然而，我们不应将SRAM和只读存储器（ROM）、Flash Memory相混淆，因为SRAM是一种易失性存储器，它只有在电源保持连续供应的情况下才能够保持数据。Random Access 指的是存储器的内容可以任意顺序进行访问，而不管前一次访问的是哪一个位置。

  （重要！！！上电后就可以读写SRAM中的数据，而无需初始化操作）

* SDRAM - 同步动态随机存取存储器 - Synchronous Dynamic Random Access Memory

  需要不断的刷新，才能保存数据。而且是行列地址复用，许多都有页模式。

  （重要！！！需要对DDR控制器进行初始化<配置寄存器>，才能去读写SDRAM中的数据）

  