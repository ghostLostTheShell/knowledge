# 自定义脚本执行
[文档](https://www.webpackjs.com/api/node/)
## 
1.  安装 webpack
npm install --save-dev webpack

2. webpack()

```js
const webpack = require("webpack");
import webpack from "webpack";
import config from "webpack_config"

webpack({
  config //配置对象
}, (err, stats) => {
  if (err || stats.hasErrors()) {
    // 在这里处理错误
  }
  // 处理完成
})

//或

const compiler = webpack({
 config //配置对象
});

compiler.run((err, stats) => {
  // ...
});
```
