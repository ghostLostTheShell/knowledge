#

## 设置监听地址和端口

```config
agentAddress  [udp:127.0.0.1:161 |  udp:161,udp6:[::1]:161 ]
```

## 视图

```config
view  ${ 视图名称：字符串 }  included ${允许访问的oid}
```

## 定义安全体名和共同体名称

```config
rocommunity  ${自定义的团体字} ${secret ${允许访问p地址} | default } -v ${视图名称}
rwcommunity    定义读写权限的共同体
rocommunity6
rwcommunity6
```

# v3用户定义

```config
rouser   authOnlyUser
rwuser   authPrivUser   priv
```
