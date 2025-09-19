# 利用js操作html 的 head 元素

操作 head 动态添加或删除子元素

## 获取head元素

```js
//1 获取 document 的  head 属性
document.head -> 
// 2 利用 document 的  getElementsByTagName 方法
document.getElementsByTagName("head")
```

## 添加元素

```js 
let headEl = document.head;
//添加script 
var script  = document.createElement('style');

script.setAttribute("src", "https://cdn.bootcss.com/jquery/1.10.2/jquery.min.js");

head.appendChild(script);


```