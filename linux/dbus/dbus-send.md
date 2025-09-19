# dbus-send
 
发送信息到消息总线

## 参数

* --system

    将命令发向系统总线，也可使用--session

* --print-reply
    打印返回结果 

* -dest=org.bluez

    对象名。由服务定义 

---

## 例子

## 通过dbus调用进入屏保

``` bash
dbus-send \
--session //总线类型\
--dest=org.gnome.ScreenSaver \
--type=method_call \
/org/gnome/ScreenSaver \
org.gnome.ScreenSaver.SetActive \
boolean:true 
```

---

## 列出所有的dbus服务

``` sh
dbus-send \
--system \
--print-reply \
--dest=org.freedesktop.DBus \
/org/freedesktop/DBus \
org.freedesktop.DBus.ListActivatableNames
```
---
查询 可用的方法
org.freedesktop.DBus.Introspectable.Introspect,