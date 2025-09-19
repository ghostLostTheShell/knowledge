# 快捷键

## Accelerator Groups

为 GtkWindow 绑定快捷键去触发一些事件

### 例子

``` python
#!/usr/bin/env python3

import gi
gi.require_version('Gtk', '3.0')
from gi.repository import Gtk, Gdk

class mywindow(Gtk.Window):
    def __init__(self):
        Gtk.Window.__init__(self, title="Hello World")
        self.button = Gtk.Button(label="Click Here")
        gag = Gtk.AccelGroup.new() # 创建 GtkAccelGroup 对象

        """为 Widget 的事件添加一个快捷键 """
        Gtk.Widget.add_accelerator(self.button,
            "clicked", #事件
            gag, # GtkAccelGroupd 对象
            69, # keyval
            Gdk.ModifierType.MOD1_MASK, # 装饰键
            Gtk.AccelFlags.VISIBLE
        )

        self.button.connect("clicked",self.on_button_clicked)
        self.add(self.button)
        Gtk.Window.add_accel_group(self,gag)

    def on_button_clicked(self, widget):
        print("Hello World")

win = mywindow()
win.connect("delete-event",Gtk.main_quit)
win.show_all()
Gtk.main() 
```
