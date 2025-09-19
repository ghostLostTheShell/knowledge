# 错误

## 无法使用mysql 的 REGEXP

解决方法:

```java
public class RegMySQLDialect  extends MySQLDialect {
    public RegMySQLDialect() {
        super();
        registerFunction("regexp", new SQLFunctionTemplate(Hibernate.INTEGER, "?1 REGEXP ?2"));
    }
}
```

然后hibernate的配置项改为: 
hibernate.dialect = com.vipshop.platform.metasys.util.RegMySQLDialect