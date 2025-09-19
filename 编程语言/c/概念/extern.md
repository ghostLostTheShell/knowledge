# extern
[关键字]

修饰变量或者函数，用来说明`此变量/函数是在别处定义的，要在此处引用 `

## 作用

- 使用后面定义的变量

``` c
#include<stdio.h>
int func();

int main()
{
  func(); //1
  printf("%d",num); // [err] 编译错误
  return 0;
}
int num = 3;
int func()
{
  printf("%d\n",num);
}

```

修改为

``` c
#include<stdio.h>
int func();

int main()
{
  func(); //1
+ extern int num;
  printf("%d",num); // 编译正常
  return 0;
}
int num = 3;
int func()
{
  printf("%d\n",num);
}

```

- 引用另一个文件中的变量

```c main.c
#include<stdio.h>
int main()
{
  extern int num;
  printf("%d",num);
  return 0;
}
```

```c b.c
#include<stdio.h>
int num = 5;
```

编译：

```bash
gcc -c main.c
gcc -c b.c
gcc main.o b.o -o app.out -lm
```

- 引用另一个文件中的函数

```c main.c
#include<stdio.h>
int main()
{
  extern void func();
  func();
  return 0;
}
```

```c b.c
#include<stdio.h>
int num = 5;
void func()
{
  printf("fun in b.c");
}
```

编译：

```bash
gcc -c main.c
gcc -c b.c
gcc main.o b.o -o app.out -lm
```

