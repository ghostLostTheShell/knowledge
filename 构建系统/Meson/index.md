# meson 构建系统
用于构建项目

手册: https://meson-manual.com/

官网: https://mesonbuild.com/

## 环境

[python]

  要求: python 版本必须是以上的3

[ninja]
  Ninja 是Google的一名程序员推出的注重速度的构建工具

## 安装

> pip install meson

## 参数

[meson.build]

通过meson.build文件配置编译项目

```
{
  type:文件

}
```

[meson_options.txt]

配置参数,为参数指定类型或默认值

指定参数值

```txt
meson builddir -D{参数:}={值}


```
## meson.build 文件函数

### project()

``` meson.build
void project(project_name, list_of_languages, ...)
```

第一个参数必须是一个字符串。表明这个项目的名称

第二个参数为指定的编程语言

### get_option(${key:str})

获取项目 `Build options` 参数

#### 文档

文档: https://mesonbuild.com/Build-options.html#features


