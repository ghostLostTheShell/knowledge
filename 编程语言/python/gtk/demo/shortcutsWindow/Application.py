import sys

import gi

gi.require_version("Gtk", "3.0")
from gi.repository import GLib, Gio, Gtk


class Application(Gtk.Application):
    
    def __init__(self, *args, **kwargs):
        super().__init__(
            *args,
            application_id="org.example.myapp",
            **kwargs
        )

    def do_activate(self):
        """startup 事件回调函数"""
        pass
    
    
if __name__ == "__main__":
    app = Application()
    app.run(sys.argv)