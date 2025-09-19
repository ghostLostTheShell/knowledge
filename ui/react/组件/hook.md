# Hook
Hook 是 React 16.8 的新增特性。它可以让你在不编写 class 的情况下使用 state 以及其他的 React 特性。

---

##  useState()

const {${var}, ${setfun}}= useState(${默认值:obj},)

作用:
  使用 `setfun` 会重新渲染当前组件。 


---

## useEffect 

useEffect(${函数:()=>});

作用:
  让你在函数组件中执行副作用操作，如果副作用需要清理，需要返回一个清理函数

---
## useRef

  const refContainer = useRef(initialValue);

  useRef 返回一个可变的 ref 对象，其 .current 属性被初始化为传入的参数（initialValue）。返回的 ref 对象在组件的整个生命周期内保持不变。

作用：
  - 获取子组件的实例，只有类组件可以使用

  - .在函数组件中定义一个全局变量，不会因为重复render重复声明，类似于组件的this.xxx

---

## useMemo 