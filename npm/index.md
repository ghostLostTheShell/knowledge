# 简要描述

## 默认配置文件的位置

* 每个项目的配置文件（/path/to/my/project/.npmrc）

* 每用户配置文件（默认为$HOME/.npmrc;可通过CLI选项--userconfig或环境变量配置$NPM_CONFIG_USERCONFIG）

* 全局配置文件（默认为$PREFIX/etc/npmrc;可通过CLI选项--globalconfig或环境变量配置$NPM_CONFIG_GLOBALCONFIG）

* npm 的内置配置文件（/path/to/npm/npmrc）

```txt
常见的配置
registry =https://registry.npm.taobao.org
```

## 使用淘宝镜像

```bash
npm i -g cnpm --registry=https://registry.npm.taobao.org
```





