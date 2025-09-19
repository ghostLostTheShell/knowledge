# stdlib

头文件：

``` c
#include <stdlib.h>
```

## free()

函数用来释放动态分配的内存空间，其原型为：

    void free (void* ptr);

free() 可以释放由 malloc()、calloc()、realloc() 分配的内存空间，以便其他程序再次使用。指向的内存空间不是由这三个函数所分配的，或者已被释放，那么调用 free() 会有无法预知的情况发生。