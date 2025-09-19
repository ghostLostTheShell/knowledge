# ShortcutsWindow
    Gtk.ShortcutsWindow一显示有关应用程序的键盘快捷键和手势的简要信息。该快捷键可以分组，你可以有多个节在此窗口中，对应于应用程序的主要模式。

    此外，该快捷方式可以通过当前视图进行过滤，以避免显示与当前上下文无关的信息。
```
    GObject
    ╰── GInitiallyUnowned
        ╰── Gtk.Widget
            ╰── Gtk.Container
                ╰── Gtk.Bin
                    ╰── Gtk.Window
                        ╰── ShortcutsWindow

```