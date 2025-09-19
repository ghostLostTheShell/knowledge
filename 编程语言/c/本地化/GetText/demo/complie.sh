#!/bin/sh


#根据源文件中的要翻译的内容生成 对于的po文件
#如果使用UTF-8
#记得将 charset 修改为 utf-8 例如
#"Content-Type: text/plain; charset=UTF-8\n"
xgettext -a sayhello.c -o sayhello.po  --from-code=utf-8


# 根据po文件生成 mo
# msgfmt sayhello.po -o locale/zh_CN/LC_MESSAGES/sayhello.mo


# mkdir -pv locale/zh_CN/LC_MESSAGES/
# -IH:\lib\msys64\mingw64\include 头文件
# -LH:\lib\msys64\mingw64\lib
# -lintl 使用 intl 库
# gcc -Wall -IH:\lib\msys64\mingw64\include -LH:\lib\msys64\mingw64\lib  -o sayhello sayhello.c -lintl