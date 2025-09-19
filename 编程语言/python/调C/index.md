# Python调用C语言

## demo
编译 
gcc -fPIC .\example1.c -o example.dll -shared  -IH:\lib\msys64\usr\include\python3.8 "-lpython3.8.dll" 
