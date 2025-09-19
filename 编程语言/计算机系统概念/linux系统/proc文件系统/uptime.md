# uptime 文件
`proc/uptime`

  作用记录当前系统的启动时间和系统空闲时间，单位为秒

## 计算 SMP 的空闲率

系统的空闲率(%) = {time: 系统空闲时间} / ( ${ time :启动时间} * ${n: cpu核心数 }) 其中N是SMP系统中的CPU个数。

  