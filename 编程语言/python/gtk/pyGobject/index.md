# GObjec

 GObject 是基于C的面向对象的API

## 继承

```python
from gi.repository import GObject

class MyObject(GObject.GObject):

    def __init__(self):
        //GObject 的继承必须在构造方法中调用父类的构造方法
        GObject.GObject.__init__(self)
```

## 事件

为GObject 定义一个事件
``` python 

class MyObject(GObject.GObject):
    __gsignals__ = {
        # 'my_signal' 为信号表示 ，当接受到 my_signal  信号时就会调用 do_my_signal 方法
        # 参数
        #
        # 第一个参数GObject.SIGNAL_RUN_FIRST 表示什么怎么调用do_my_signal，有三种状态
        # * GObject.SIGNAL_RUN_FIRST 接受到事件的第一阶段就调用  do_my_signal
        # * GObject.SIGNAL_RUN_LAST 接受到事件的第二阶段就调用  do_my_signal
        # * GObject.SIGNAL_RUN_CLEANUP 接受到事件的最后阶段就调用  do_my_signal
        #
        # 第二个参数 None
        # 表示事件处理函数的返回值 一般为 None
        #
        # 第三个参数 (int,)
        # 表示事件处理的返回值的参数


        'my_signal': (GObject.SIGNAL_RUN_FIRST, None,
                      (int,))
    }

    def do_my_signal(self, arg):
        print("method handler for `my_signal' called with argument", arg)


```

发送事件

```
 my_obj.emit("my_signal", 42)
```