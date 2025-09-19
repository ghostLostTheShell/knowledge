# Vue中的model
``` 
<input v-model="something"> 相当于:

<input
  v-bind:value="something"
  v-on:input="something = $event.target.value">
```

## v-model语法糖:
