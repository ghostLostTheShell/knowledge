# 

## 自定义组件使用 v-model

``` vue 

<template>
  <div>
    <slot name="label"></slot>
    <input  @input="inputEvent($event)" />    
  </div>
</template>

<script>
export default {
  name: "xInput",
  model:{
    prop: 'value',
    event: 'change.value'
  },
  props: {
    value: String,
  },
  data: () =>{
    return {
      message: ""
    }
  },
  methods:{
    inputEvent(event){
      //input 输入事件
      this.$emit("change.value", event.target.value);
    }
  }
};
</script>


//调用
...
<xInput v-model="${变量}">
...

```