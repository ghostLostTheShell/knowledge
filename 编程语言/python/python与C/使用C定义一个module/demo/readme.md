# 

## 编译

模块命名规则
-o *.pyd | *-cpython-38.dll 

``` bash
gcc -fvisibility=hidden -fPIC .\demo-module.c -o .\distribute\demo.pyd -shared  -IH:\lib\msys64\mingw64\include\python3.8 "-lpython3.8.dll" 

```
