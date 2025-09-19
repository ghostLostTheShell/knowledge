# 自定义bean的注入方式

我们可以通过实现`BeanDefinitionRegistryPostProcessor`来实现自定义bean的注入方式

## 例子

``` java
@Component
public class TestPostProcessorRegistration implements BeanDefinitionRegistryPostProcessor{
    @Override
    public void postProcessBeanDefinitionRegistry(BeanDefinitionRegistry registry) throws BeansException {
        //创建BeanDefinitionBuilder
        BeanDefinitionBuilder builder = BeanDefinitionBuilder.rootBeanDefinition(UserInfoEntity.class);
        //设置属性值
        builder.addPropertyValue("name","list_test");
        //设置可通过@Autowire注解引用
        builder.setAutowireMode(AUTOWIRE_BY_NAME)
        //注册到BeanDefinitionRegistry
        registry.registerBeanDefinition("userInfoEntity",builder.getBeanDefinition());
    }
    @Override
    public void postProcessBeanFactory(ConfigurableListableBeanFactory beanFactory) throws BeansException {

    }
}
```
