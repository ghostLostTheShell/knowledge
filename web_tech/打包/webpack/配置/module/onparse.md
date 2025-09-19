# module.noParse

不去解析属性值代表的库的依赖

## 例如

我们一般引用jquery

```js
import jq from 'jquery'
```

对于上面的解析规则，当解析jq的时候，会去解析jq这个库是否有依赖其他的包，我们对类似jq这类依赖库，一般会认为不会引用其他的包(特殊除外,自行判断)。所以，对于这类不引用其他的包的库，我们在打包的时候就没有必要去解析，这样能够增加打包速率。可以在webpack的配置中增加noParse属性

```js

{
  // ...
  module:{
    noParse: /jquery/ //不去解析jquery中的依赖库
  }
}
```

## noParse 的值类型

* RegExp

* [RegExp]

* function（从 webpack 3.0.0 开始）
