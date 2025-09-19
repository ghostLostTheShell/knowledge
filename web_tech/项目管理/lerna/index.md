# lerna
用于管理 js 项目的多个package

作用:
*  为了降低多package项目的维护成本

---
## 安装
  npm install -g lerna 

---

---
## 概念

* 管理模式
  - Fixed mode (默认)
    
    [描述]
    
    固定模式中，packages下的所有包共用一个版本号(version)，会自动将所有的包绑定到一个版本号上(该版本号也就是lerna.json中的version字段)，所以任意一个包发生了更新，这个共用的版本号就会发生改变。

  - Independent mode
   
    [设置] 
      
      在启动 初始化项目时指定 --independent 

      >lerna init --independent 

    [描述]  
    
    独立模式允许每一个包有一个独立的版本号，在使用lerna publish命令时，可以为每个包单独制定具体的操作，同时可以只更新某一个包的版本号。此种模式时，lerna.json中的version字段指定为independent即可
