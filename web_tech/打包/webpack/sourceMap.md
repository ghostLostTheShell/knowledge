# Webpack：SourceMap 的配置
解决源代码和目标生成代码的映射关系

## 关闭SouceMap

```js
module.exports = {
    devtool="none"
}

```
## 开启SourceMap
```js
module.exports = {
    devtool="source-map"
}
```
开启SourceMap后，多出.js.map文件，这个文件里面是映射的对应关系

<h2>添加inline前缀</h2>

```js
module.exports = {
    devtool="inline-source-map"
}

```

映射文件会被直接写进js文件当中，base64形式的字符串，在js的底部

<h2>添加cheap前缀</h2>

```js
module.exports = {
    devtool="cheap-inline-source-map"
}

```

* 告诉我那一行出错就好，不用告诉我那一列出错，节约性能，提高打包速度 
* 只映射业务代码，而不映射第三方包、库