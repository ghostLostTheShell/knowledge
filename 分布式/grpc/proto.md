#

## 服务

service ${服务名称} {
    rpc ${方法名称}(${参数类型}) returns (${返回类型});
}
>方法不能不传参数，不能不返回结果

### 不想传参和返回结果时的解决方法

```
import "google/protobuf/empty.proto";

service mySevice {
    rpc list(google.protobuf.Empty) returns (reust);
}
```

## message 用于指定参数类型

message ${名称} {
    //repeated 指定这个属性可以在一个正确的消息格式中重复任意次数(包括零次)
    repeated string query = 1;
    //repeated 指定这个属性可以有零个或者多个这样的消息属性(但是不要超过一个).
    singular string query =2
}