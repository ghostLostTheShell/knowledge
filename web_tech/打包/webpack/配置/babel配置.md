# babel配置

  作用编译 js, mjs, jsx, ts, tsx


## 编译ts与tsx

```js
{
  test: /\.(js|mjs|jsx|ts|tsx)$/,
    include: pojectPath.src, //项目源码路径
    loader: 'babel-loader',
    options: {
              presets: [
                        "@babel/preset-env",  
                        [
                          "@babel/preset-react",
                          {runtime: 'automatic'},
                        ],
                        "@babel/preset-typescript"
                    ],
              }
}
```

- es2015 支持
  安装插件

  "plugins": [
    "@babel/proposal-class-properties",
    "@babel/proposal-object-rest-spread"
  ]


> tsx 补全依赖
"@types/node": "^12.6.9",
"@types/react": "^16.8.24",
"@types/react-dom": "^16.8.5",