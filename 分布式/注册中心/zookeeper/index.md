## 下载
  下载地址： https://zookeeper.apache.org/releases.html

## win 系统环境配置  
新建 `${zookeeper_根目录}/conf/zoo.cfg` ,添加以下内容

```
tickTime=2000
initLimit=10
syncLimit=5
dataDir=D:\\app\\apache-zookeeper-3.6.2-bin\\apache-zookeeper-3.6.2-bin\\data
dataLogDir=D:\\app\\apache-zookeeper-3.6.2-bin\\apache-zookeeper-3.6.2-bin\\log
clientPort=2181
```
新建 `${dataDir}/myid` ,添加以下内容
```
1
```
