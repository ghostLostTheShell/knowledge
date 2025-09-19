# iterable

对象是否可迭代

判断对象是否可迭代

* 
```
from collections import Iterable, Iterator

isinstance(${obj}, Iterable)

```

## 创建可迭代对象

1. iter 函数

  * iter(obj)

  * iter(object, sentinel)

    如果对象是可调用对象，则当返回值与`sentinel`相同时，迭代将停止。

## 获取可迭代对象的内容

1. next

  next(${可迭代对象})