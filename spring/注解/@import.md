# @Import 注解

## 作用

### 1.@Import引入普通类

``` java

@Import({Bean1.class, Bean2.class})
public class App {
    //
    public static void main(String[] args) throws Exception {
      ...
```

### 2.@Import引入配置类
