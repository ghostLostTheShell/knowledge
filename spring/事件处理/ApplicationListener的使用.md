# ApplicationListener的使用

## 简介
  
  如果容器中存在ApplicationListener的Bean，当ApplicationContext调用publishEvent方法时，对应的Bean会被触发

## spring内置事件

|内置事件|描述|
|----|----|
|ContextRefreshedEvent|ApplicationContext 被初始化或刷新时，该事件被触发。这也可以在 ConfigurableApplicationContext接口中使用 refresh() 方法来发生。此处的初始化是指：所有的Bean被成功装载，后处理Bean被检测并激活，所有Singleton Bean 被预实例化，ApplicationContext容器已就绪可用|
|ContextStartedEvent|当使用 ConfigurableApplicationContext （ApplicationContext子接口）接口中的 start() 方法启动 ApplicationContext 时，该事件被发布。你可以调查你的数据库，或者你可以在接受到这个事件后重启任何停止的应用程序。|
|ContextStoppedEvent|当使用 ConfigurableApplicationContext 接口中的 stop() 停止 ApplicationContext 时，发布这个事件。你可以在接受到这个事件后做必要的清理的工作。|
|ContextClosedEvent|当使用 ConfigurableApplicationContext 接口中的 close() 方法关闭 ApplicationContext 时，该事件被发布。一个已关闭的上下文到达生命周期末端；它不能被刷新或重启。|
|RequestHandledEvent|这是一个 web-specific 事件，告诉所有 bean HTTP 请求已经被服务。只能应用于使用DispatcherServlet的Web应用。在使用Spring作为前端的MVC控制器时，当Spring处理用户请求结束后，系统会自动触发该事件。|

> 事件可以自定义、监听也可以自定义

## 为容器添加监听器

### 方法一

使用 `ApplicationContext` 的 addApplicationListener 方法手动添加

``` java
CurentapplicationContext.addApplicationListener(CustomizeApplicationListener); // 添加自定义监听器到当前容器中
```

### 方法二

通过bean自动注入


## 例子 添加监听者bean

### 1

通过 继承 `ApplicationListener` 的bean 注入到容器中

``` java
/**
  添加监听者bean
**/
@Component
public class MyListener implements ApplicationListener<ContextRefreshedEvent> {
    /**
    * event 为你关注的事件可以通过继承 ApplicationEvent  自定义
    * 自己的事件
    **/
    @Override
    public void onApplicationEvent(ContextRefreshedEvent event) {
        System.out.println("容器中初始化Bean数量:" + event.getApplicationContext().getBeanDefinitionCount());
    }

}
```

### 2

使用 spring boot 可以通过 `spring.factories` 文件的 `org.springframework.context.ApplicationListener` 指定

``` factories
org.springframework.context.ApplicationListener=jun.spring.MyListener
```

``` java
package jun.spring.MyListener;

public class MyListener implements ApplicationListener<ContextRefreshedEvent> {

    @Override
    public void onApplicationEvent(ContextRefreshedEvent event) {
        System.out.println("容器中初始化Bean数量:" + event.getApplicationContext().getBeanDefinitionCount());
    }
}

```
