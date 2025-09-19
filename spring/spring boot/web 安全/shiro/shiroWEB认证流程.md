# shiroWEB认证流程

认证过滤器 -> 
# 认证过滤器流程
通常继承 `BasicHttpAuthenticationFilter` 适配自己的业务

    大概流程经过的方法 preHandle 
    onPreHandle -> isAccessAllowed -> isLoginAttempt -> executeLogin

### preHandle

### onPreHandle
    如果返回真继续进行验证操作,假就跳到验证失败
> isAccessAllowed 此方法用于判断这个在预处理阶段 url 是否允许访问

> onAccessDenied 预处理阶段 url 是不允许访问的处理

### isLoginAttempt

### sendChallenge 
用于错误处理