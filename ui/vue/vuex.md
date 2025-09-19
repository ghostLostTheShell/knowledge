# vuex

## 

```js
Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    count: 0
  },
  //提交操作, 不能异步操作
  mutations: {
    increment (state) {
      state.count++
    }
  }
  //Action 类似于 mutation，不同在于：
  //Action 提交的是 mutation，而不是直接变更状态。
  //Action 可以包含任意异步操作。
  actions: {
    increment (context) {
      context.commit('increment')
    }
  }
  //Getter
  getters: {
    doneTodos: state => {
      return state.count.filter(todo => todo.done)
    }
  }
})

//提交 mutations 操作
store.commit('increment')

//触发 Action
store.dispatch('increment')

//在组件中分发 Action
import { mapActions } from 'vuex'

export default {
  // ...
  methods: {
    ...mapActions([
      'increment', // 将 `this.increment()` 映射为 `this.$store.dispatch('increment')`

      // `mapActions` 也支持载荷：
      'incrementBy' // 将 `this.incrementBy(amount)` 映射为 `this.$store.dispatch('incrementBy', amount)`
    ]),
    ...mapActions({
      add: 'increment' // 将 `this.add()` 映射为 `this.$store.dispatch('increment')`
    })
  }
}

//mapGetters 辅助函数
import { mapGetters } from 'vuex'

export default {
  // ...
  computed: {
  // 使用对象展开运算符将 getter 混入 computed 对象中
    ...mapGetters([
      'doneTodosCount',
      'anotherGetter',
      // ...
    ])
  }
}

```

