# 错误及解决方法

## CAfile: 文件丢失
>错误提示：

```
fatal: unable to access 'https://gitee.com/qwe123dfe/knowledge.git/': error setting certificate verify locations:
  CAfile: h:/Program Files/Git/mingw64/ssl/certs/ca-bundle.crt
  CApath: none
```

>解决方法：

```bash
git config --system http.sslcainfo "${安装目录}\git\bin\curl-ca-bundle.crt"
```


