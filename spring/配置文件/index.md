# spring 的配置文件

spring 的默认支持的配置文件有 yml 和 propertites.默认文件名为 application.[yml|propertites]

## 配置文件加载位置

默认加载位置

1. –file:./config/
2. –file:./
3. –classpath:/config/
4. –classpath:/
优先级由高到底，高优先级的配置会覆盖低优先级的配置；SpringBoot会从这四个位置全部加载主配置文件

手动指定加载文件位置
启动时加上 `--spring.config.location` 参数

例如：

``` bash
java -jar spring-boot-demo-0.0.1-SNAPSHOT.jar --spring.config.location=G:/application.properties
```

## 配置文件提示

用于给编辑器显示提示
配置文件为： META-INF/spring-configuration-metadata.json
