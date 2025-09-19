# 获取ApplicationContext

***

## 1.使用 Autowired 注解

``` java
@Component
public class Book1 {

    @Autowired
    private ApplicationContext applicationContext;

    public void show (){
        System.out.println(applicationContext.getClass());
    }
}
```

***

## 2.实现 ApplicationContextAware

ApplicationContextAware 接口的 `setApplicationContext` 方法容器初始化完成后会自动调用 `setApplicationContext` 方法

``` java
public class T implements ApplicationContextAware {

    private ApplicationContext applicationContext;
    @Override
    public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
        this.applicationContext = applicationContext;

    }

    public ApplicationContext getApplicationContext(){
        return applicationContext;
    }
}
```