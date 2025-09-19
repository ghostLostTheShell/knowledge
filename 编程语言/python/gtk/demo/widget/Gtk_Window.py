"""
GTK.Window Demo

可以包含其它的Widgets

Object Hierarchy:

GObject
    ╰── GInitiallyUnowned
        ╰── Gtk.Widget
            ╰── Gtk.Container
                ╰── Gtk.Bin
                    ╰── Gtk.Window
                        ├── Gtk.Dialog
                        ├── Gtk.ApplicationWindow
                        ├── Gtk.Assistant
                        ├── Gtk.OffscreenWindow
                        ╰── Gtk.Plug
"""
import sys

import gi

gi.require_version("Gtk", "3.0")
from gi.repository import GLib, Gio, Gtk


class Application(Gtk.Application):
    def __init__(self, *args, **kwargs) -> None:
        super().__init__(*args, 
                         application_id = "jun.example.GtkWindowDemo", 
                         **kwargs)
                
    def do_activate(self):
        mainWindow :Gtk.Window = Gtk.Window(application=self,  title="一个测试demo")
        mainWindow.present()
        
        # 隐藏标题栏
        windowHintTitle :Gtk.Window = Gtk.Window(application=self,  title="没有标题的")
        windowHintTitle.set_skip_taskbar_hint(False) #不在任务栏中显示
        windowHintTitle.set_decorated(False) # 隐藏标题栏
        windowHintTitle.present()
        
        #设置透明度
        # windowHintTitle.set_opacity(0.5) #过期不推荐使用
        windowHintTitle.set_property("opacity",  0.5)
        
        
        # PoPuP
        windowPopup :Gtk.Window = Gtk.Window(application=self, type = Gtk.WindowType.POPUP)
        mainWindow.set_keep_below(True)
        windowPopup.present()
        
        #设置为顶层,始终位于所有窗口的顶层，
        mainWindow.set_keep_above(True)
        

if __name__ == "__main__":
    app = Application()
    app.run(sys.argv)