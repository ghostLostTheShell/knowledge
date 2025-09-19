# 表达式

  js的表达式

---

## <span style="color: #1a73e8">立即执行函数</span>

表达式:

>( @{ 函数定义 } ) ( @{函数参数}... ).

```js

((a,b,c)=>{return a + b + c})(1,2,3);
//=> 6

```
作用：

* 隐藏变量，避免全局污染

* 可以读取函数内部的变量

应用：

* 模拟私有方法

---

## <span style="color: #1a73e8">执行单个或多个表达式</span>

表达式:

> ( @{表达式}, @{表达式}, @{表达式})

``` js
(1+1, 2+3 , 3 + 4);
//=>7
```

作用：

执行表达式，并返回最后一条表达式的结果
---

## <span style="color: #1a73e8">读取undefined属性的属性不抛出错误</span>

> ${@object}.${@property}?.${@property}

``` js
let obj = {}

obj.undefProp?.prop
//=>undefined
```

作用：

  * 避免属性为 `undefined` 时， 抛出错误， 并返回 undefined

