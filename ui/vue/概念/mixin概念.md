# mixin
    混入 (mixin) 提供了一种非常灵活的方式，来分发 Vue 组件中的可复用功能。

## Mixin 对象
    {
        created: 初始化函数

        methods:{
            函数名: (){

            },...
        }
    }

## 注册 

全局注册

    Vue.mixin

组件注册
    var Component = Vue.extend({
    ...,
    mixins: [myMixin]
    })