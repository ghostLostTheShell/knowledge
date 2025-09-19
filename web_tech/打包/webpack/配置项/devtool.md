# webpack 的 devtool
  
## false

 不生成 source-map

## 'eval-source-map'

  生成 source-map 供浏览器展示

> eval-source-map 不会生成独立的source-map文件，而是直接将信息写到源文件bundle.js里

---
## source-map
  产生一个单独的source-map文件，功能最完全，但会减慢打包速度

---
## cheap-module-source-map

会产生一个不带映射到列的单独的map文件，开发者工具就只能看到行，但无法对应到具体的列（符号），对调试不便

---
##  cheap-module-eval-source-map
不会产生单独的map文件，（与eval-source-map类似）但开发者工具就只能看到行，但无法对应到具体的列（符号），对调试不便
