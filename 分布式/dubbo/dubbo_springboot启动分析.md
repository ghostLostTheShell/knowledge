#

## 添加 `org.apache.dubbo` 的 spring-boot-starter 依赖

``` maven
<dependency>
  <groupId>org.apache.dubbo</groupId>
  <artifactId>dubbo-spring-boot-starter</artifactId>
  <version>2.7.8</version>
</dependency>
```

## dubbo-spring-boot-starter

`dubbo-spring-boot-starter` 由两个依赖

### 1

``` maven
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter</artifactId>
  <optional>true</optional>
</dependency>
```

### 2

``` maven
<dependency>
  <groupId>org.apache.dubbo</groupId>
  <artifactId>dubbo-spring-boot-autoconfigure</artifactId>
  <version>2.7.8</version>
</dependency>
```

- 主要的自动配置由 `dubbo-spring-boot-autoconfigure` 完成

## `dubbo-spring-boot-autoconfigure`

由 `spring.factories` 指定自动配置类

``` factories
org.springframework.boot.autoconfigure.EnableAutoConfiguration=\
org.apache.dubbo.spring.boot.autoconfigure.DubboRelaxedBinding2AutoConfiguration
```

`dubbo-spring-boot-autoconfigure` 再由`dubbo-spring-boot-autoconfigure-compatible` 继续添加自动配置信息

``` maven
<dependency>
  <groupId>org.apache.dubbo</groupId>
  <artifactId>dubbo-spring-boot-autoconfigure-compatible
  <artifactId>
    <version>2.7.8</version>
  </dependency>
```

## `dubbo-spring-boot-autoconfigure-compatible`

``` factories
org.springframework.boot.autoconfigure.EnableAutoConfiguration=\
org.apache.dubbo.spring.boot.autoconfigure.DubboAutoConfiguration,\
org.apache.dubbo.spring.boot.autoconfigure.DubboRelaxedBindingAutoConfiguration
org.springframework.context.ApplicationListener=\
org.apache.dubbo.spring.boot.context.event.OverrideDubboConfigApplicationListener,\
org.apache.dubbo.spring.boot.context.event.DubboConfigBeanDefinitionConflictApplicationListener,\
org.apache.dubbo.spring.boot.context.event.WelcomeLogoApplicationListener,\
org.apache.dubbo.spring.boot.context.event.AwaitingNonWebApplicationListener
org.springframework.boot.env.EnvironmentPostProcessor=\
org.apache.dubbo.spring.boot.env.DubboDefaultPropertiesEnvironmentPostProcessor
org.springframework.context.ApplicationContextInitializer=\
org.apache.dubbo.spring.boot.context.DubboApplicationContextInitializer
```
