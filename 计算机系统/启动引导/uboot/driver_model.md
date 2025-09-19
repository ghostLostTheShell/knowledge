# driver model

设计目的

- 提供统一设备驱动框架，降低设备驱动的开发复杂度

- 提供设备树视图

- 支持设备组

- 支持设备lazy init

- 支持设备驱动沙盒测试

- 较小的系统开销

## DM 初始化流程

---

dm_init_and_scan

        |
        |
    dm_init() 
    
    创建 udevice 和 ucalss 空链表。 创建根设备(root_device)

        |
        |

    dm_scan_platdata 
    
    扫描U_BOOT_DEVICE定义的设备，创建对应的udevice和uclass对象，查找并绑定相应driver，并调用probe流程。

        |
        |

    dm_scan_fdt()
    
    扫描由FDT设备树文件定义的设备，创建对应的udevice和uclass对象，查找并绑定相应driver，并调用probe流程。

---
