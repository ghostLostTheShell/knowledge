
#

## 例子

``` go

package main

import (
	"github.com/gotk3/gotk3/glib"
	"github.com/gotk3/gotk3/gtk"
	"log"
	"os"
)

func main() {
	const appId = "com.nayoso.example"

	app, _ := gtk.ApplicationNew(appId, glib.APPLICATION_FLAGS_NONE)
	app.Connect("activate", func() {
		onActivate(app)
	})
	app.Run(os.Args)
}
//-- 在开始我们还是使用我们熟悉的代码

func onActivate(application *gtk.Application) {
	if builder, err := gtk.BuilderNewFromFile("builder.ui"); err != nil {	//从文件中创建Builder
		log.Fatal(err)
	} else if winObj, err := builder.GetObject("window"); err != nil {	//从文件中读取window对象，其实际上是Gobject
		log.Fatal(err)
	} else {
		window := winObj.(*gtk.Window)	//由于winObj是Gobject，所以我们使用类型断言得到Gtk.Window对象
        application.AddWindow(window)	//记得将window加入我们的application中
        
		window.ShowAll()
	}
}
```

``` Builder.ui
<interface>
    <object id="window" class="GtkWindow">
        <property name="visible">True</property>
        <property name="title">Grid</property>
        <property name="border-width">10</property>
        <child>
            <object id="grid" class="GtkGrid">
                <property name="visible">True</property>
                <child>
                    <object id="button1" class="GtkButton">
                        <property name="visible">True</property>
                        <property name="label">Button 1</property>
                    </object>
                    <packing>
                        <property name="left-attach">0</property>
                        <property name="top-attach">0</property>
                    </packing>
                </child>
                <child>
                    <object id="button2" class="GtkButton">
                        <property name="visible">True</property>
                        <property name="label">Button 2</property>
                    </object>
                    <packing>
                        <property name="left-attach">1</property>
                        <property name="top-attach">0</property>
                    </packing>
                </child>
                <child>
                    <object id="quit" class="GtkButton">
                        <property name="visible">True</property>
                        <property name="label">Quit</property>
                    </object>
                    <packing>
                        <property name="left-attach">0</property>
                        <property name="top-attach">1</property>
                        <property name="width">2</property>
                    </packing>
                </child>
            </object>
            <packing>
            </packing>
        </child>
    </object>
</interface>
```