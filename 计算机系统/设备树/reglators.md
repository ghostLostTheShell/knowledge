# regulator系统

对负载电源进行开关和稳压控制的模型叫 `regulators` 


## 相关概念

Regulator : 电源芯片, 比如电压转换芯片

Consumer : 消费者,使用电源的部件, Regulator是给Consumer供电的

machine : 单板,上面焊接有Regulator和Consumer

Constraints : 约束, 比如某个电源管理芯片输出的电压范围

Supply : 提供电源的部件, Regulator就是一个Supply; Regulator A可以给Regulator B供电, 那么Regulator B的Supply就是A


# 参考

1. https://www.cnblogs.com/hellokitty2/p/9975711.html

2. https://blog.csdn.net/spongebob1912/article/details/109517707

3. https://www.jianshu.com/p/b22abebb3089