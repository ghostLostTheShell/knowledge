# spring-boot + shiro web JWT 认证

## 导入依赖
1. 导入 `shiro` maven依赖
   
    ``` maven
    <dependency>
        <groupId>org.apache.shiro</groupId>
        <artifactId>shiro-spring-boot-web-starter</artifactId>
        <version>1.6.0</version>
    </dependency>
    ```
2. 导入 `JWT依赖`

    ``` maven
    <dependency>
        <groupId>com.auth0</groupId>
        <artifactId>java-jwt</artifactId>
        <version>3.8.3</version>
    </dependency>

    ```