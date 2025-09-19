# 简介
    
[api参考文档](https://developer.gnome.org/references)

相关文档：

* https://www.gnu.org/software/g-golf/

## PyGTK 的库引用规则

``` python
gi.require_version("Gtk", "3.0")
from gi.repository import Gtk
```

## GTK+ 的仓库有

* GObject
    GTK+ 的基础类型， 

* Gst

* Gtk
    gtk + 用于提供创建图像用户界面的库

    [gtk3文档](https://developer.gnome.org/gtk3/stable/gtk.html)

    [gtk4文档](https://developer.gnome.org/gtk3/stable/gtk.html)

* xlib

* Pango

* Gio

* Glib

    Glib 是提供通用工具的库，

    [文档](https://developer.gnome.org/glib/stable/)

* Gdk
    GdkPixbuf 是一个图像加载和处理库

* Atk

* cairo
    Cairo 是一个支持多种输出设备的 2D 绘图库。其设计为在所有输出媒体上产生一致的输出，同时在可能时利用显示硬件加速。
* GModule

