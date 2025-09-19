# 自定义

## 设置 jpa dialect设置

```yml
#1
spring:
  jpa:
    database-platform: org.hibernate.dialect.MySQL5Dialect
#2
spring:
  jpa:
    properties:
      hibernate:
        dialect: org.hibernate.dialect.MySQL5InnoDBDialect
```