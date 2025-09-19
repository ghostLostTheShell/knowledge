# Gtk.Box

一个容器用于放置 widgets 进一行或一列中

## 对象结构
```
GObject
    ╰── GInitiallyUnowned
        ╰── Gtk.Widget
            ╰── Gtk.Container
                ╰── Gtk.Box
                    ├── Gtk.AppChooserWidget
                    ├── Gtk.ButtonBox
                    ├── Gtk.ColorChooserWidget
                    ├── Gtk.ColorSelection
                    ├── Gtk.FileChooserButton
                    ├── Gtk.FileChooserWidget
                    ├── Gtk.FontChooserWidget
                    ├── Gtk.FontSelection
                    ├── Gtk.HBox
                    ├── Gtk.InfoBar
                    ├── Gtk.RecentChooserWidget
                    ├── Gtk.StackSwitcher
                    ├── Gtk.Statusbar
                    ╰── Gtk.VBox
```
## Functions

### gtk_box_pack_start ()

往box 的开头添加子组件

``` txt
child:Widget  要添加的子组件
expand:[boolean] 是否跟随父组件自动扩展大小
fill:[boolean] 是否跟随父组件自动扩展大小
padding[int] 组件之间的间隙
```

### gtk_box_pack_end ()

往box 的尾部添加子组件

### reorder_child()


## Properties

| x | x | x |
| ---- | ---- | ---- |
|GtkBaselinePosition| baseline-position|   Read / Write|
|gboolean    |homogeneous |Read / Write|
|int |spacing |Read / Write|

### homogeneous

设置子组件是否一样的大小， 默认为FALSE

### spacing

子组件间的间隙，默认为0，
Allowed values: >= 0
