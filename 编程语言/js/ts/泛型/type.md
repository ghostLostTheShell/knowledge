# type

[ 作用 ]

  类型别名会给一个类型起个新名字

# 用例

1. 给已有的类型起别名

``` ts
type 字符串 = string;
type 数字 = number;
```

2. 创建新的类型

``` ts
type x属性 = {
  b: string
}
//定义一个类型包含属性b，b为字符串。

type x函数 = (a:string) => string
//定义一个字符串参数a,返回值为字符串的函数。

```

3. | 操作符


4. & 操作符

5. 可索引类型

6. 字符串字面量

```ts
type Name = "sb1"|"sb2"|"sb3";

let theName:Name = "sb1";

let theName1:Name = "sb4"; //错误


```

