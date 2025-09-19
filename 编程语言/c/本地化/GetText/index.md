# 使用GetText本地化编程

GetText是GNU的一个项目，用于对进行对软件的多语言支持

原理就是： 当你在输出的字符串前加上 gettext 函数时，系统会去对应的文件(.mo文件)中找该字符串是否存在翻译，如果存在就显示翻译后的字符串，如果没有对应翻译项就直接显示。

.mo文件默认搜索目录
  
* ./locale/{$语言}/LC_MESSAGES/
  
* `/usr/share/locale/`
  linux 的.mo文件一般存放在 `/usr/share/locale/` 中对应的语言中的`LC_MESSAGES`对于的软件名称.mo

# 环境

[GNU gettext-tools]
  用于制作mo文件
