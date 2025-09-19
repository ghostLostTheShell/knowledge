# linux 安装配置 snmpd

## 安装相关软件

```bash
apt-get install snmpd #snmp服务端软件
apt-get install snmp #snmp客户端软件
apt-get install snmp-mibs-downloader #来下载更新本地mib库的软件
```

> 在安装snmp-mibs-downloader的过程中，程序会帮我们自动下载mib库，并保存在/usr/share/mibs目录中

## 测试命令

```bash
snmpwalk -v ${版本} -c ${团体字} ${地址} ${OID}
```

测试oid


