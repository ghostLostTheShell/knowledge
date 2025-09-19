# meson.build 文件

 配置参考手册: https://mesonbuild.com/Reference-manual.html

## 设置变量

  {变量名} = 值

## 运算符和条件

```bulid
  if {v1}=={v2}
    ....
  else
    ....
  endif
```
## 字符串操作
  'xx@0@, @1@'.format(1, 2)

## project()

  主要用于设置项目名称

## import()

## error()

  打印错误信息

## get_option()

  获取命令行参数的值

## configuration_data()

  为configure_file注入环境变量

## configure_file()
  
  配置文件  