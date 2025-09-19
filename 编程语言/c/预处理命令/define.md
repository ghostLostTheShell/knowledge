# define

  用来替换

## 例子

``` c
#define PI 3.14

printf(PI)

#define MAX(x,y) (((x)>(y))?(x):(y))

printf(MAX(3, 4))


```


## 相关

#ifdef如果宏已经定义，则编译下面代码

#ifndef如果宏没有定义，则编译下面代码

#undef取消已定义的宏

###  宏拼接

``` c 
//#的用法
#define  strcpy__(dst, src)      strcpy(dst, #src)

strcpy__(buff,abc)  相当于 strcpy__(buff,"abc")

//##是连接符号，把参数连接在一起
#define FUN(arg)     my##arg

则 FUN(ABC)等价于  myABC
```