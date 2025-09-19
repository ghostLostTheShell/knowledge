#

include 的用法有两种，如下所示：

```c
#include <stdHeader.h> // 编译器会到系统路径下查找头文件

#include "myHeader.h" // 编译器首先在当前目录下查找头文件，如果没有找到，再到系统路径下查找。
```