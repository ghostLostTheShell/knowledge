# 'unhandledRejection' 事件

如果在事件循环的一次轮询中，一个 Promise 被拒绝，并且此 Promise 没有绑定错误处理器， 'unhandledRejection 事件会被触发。

## 例如