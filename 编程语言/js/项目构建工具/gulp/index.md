# gulp

## 安装

全局安装: npm install --global gulp-cli

仅当前项目安装: npm install --save-dev gulp


## 概念

### 任务

每个gulp任务都是一个异步函数，一个可以接收 callback 作为参数的函数，或者是一个返回 stream、promise、event emitter、child process 或 observable (后面会详细讲解) 类型值的函数

任务有公开任务和私有任务

### 组合任务

作用:
  将多个独立的任务组合为一个

* 顺序执行
  按顺序执行组合的任务
  
实现：
  series() 方法

  ``` js 例子
const { series } = require('gulp');

function 任务1(cb) {
  // body omitted
  cb();
}

function 任务2(cb) {
  // body omitted
  cb();
}

exports.build = series(任务1, 任务2);

  ```

* 并发来运行的任务

实现：
  使用 `parallel()` 方法



