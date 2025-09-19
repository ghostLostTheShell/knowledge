# java selevlet 过滤器

## 简要
过滤器功能由 `Filter` 和 `FilterChain` 完成 
1. Filter 有三个主要的方法

>`init` : 由 web 容器调用,用于执行初始化的操作

>`doFilter`：执行过滤的业务, 有三个参数

>> 1. `ServletRequest` 
>> 1. `ServletResponse`
>> 2. `FilterChain` 过滤器链


>`destroy`: 由 web 容器调用,用于执行注销是的操作

2. FilterChain 有一个主要的方法
>  `doFilter`： 有两个参数
>> 1. `ServletRequest` 
>> 1. `ServletResponse`

## ApplicationFilterChain
`ApplicationFilterChain` 是tomcat 对 `FilterChain` 接口实现的实现类
