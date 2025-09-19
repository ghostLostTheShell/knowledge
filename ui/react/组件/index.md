# React.Component
React 的组件可以定义为 class 或函数的形式。

组件必须实现  render 方法

---
## props

- 默认属性

    如果父组件在调用子组件时，没有给子组件传值，子组件使用的就是 `defaultProps`里定义的默认值。

    例子:

    ```js
    class demo extends React.Component {
        constructor(props) {
            super(props)
        }

        render(){
            retrun (
                <div>
                    <h3>父组件传来的msg为：{ this.props.msg }</h3>
                </div>
            )
        }
    }
    
    demo.{
        msg: '初始值'//
    }

    ```

- 属性校验

    校验属性的合法性，使用 `prop-types` 库


---
## state


## 组件的生命周期 

当组件实例被创建并插入 DOM 中时，其生命周期调用顺序如下：

1. 挂载

    当组件实例被创建并插入 DOM 中时，其生命周期调用顺序如下：

    * constructor()

    * static getDerivedStateFromProps()

    * render()

    * componentDidMount()

2. 更新

    当组件的 props 或 state 发生变化时会触发更新

    * static getDerivedStateFromProps()
    
    * shouldComponentUpdate()

    * render()
    
    * getSnapshotBeforeUpdate()

    * componentDidUpdate()

3. 卸载

    当组件从 DOM 中移除时会调用

    * componentWillUnmount()

4. 错误处理
    当渲染过程，生命周期，或子组件的构造函数中抛出错误时

    * static getDerivedStateFromError()
    
    * componentDidCatch()


## 调试相关

- displayName

    定义调试时的组件name