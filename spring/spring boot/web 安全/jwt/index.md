# JWT
JSON Web Token（JWT）是目前最流行的跨域身份验证解决方案

JSON Web令牌是一种开放的行业标准 RFC 7519方法，用于在双方之间安全地表示声明

# jwt数据结构
JWT有三部分组成：`Header`:头部，`Payload`:负载，`Signature`:签名

#  工具包
### java 工具包
1. java-jwt
   
    ``` maven
    <!-- https://mvnrepository.com/artifact/com.auth0/java-jwt -->
    <dependency>
        <groupId>com.auth0</groupId>
        <artifactId>java-jwt</artifactId>
        <version>3.10.3</version>
    </dependency>
    ```
