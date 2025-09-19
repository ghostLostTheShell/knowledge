# trait
类似与java的接口

Trait只能由三部分组成（可能只包含部分）：
  - functions

  - types

  - constants

## 定义

```rust
struct Humanity{
  name:String,
  age:u8
}
trait speak{
  fn grreet(&self){
    println!("你好");
  }
}

impl speak for Humanity{}



```
## 概念

* Self与self

  Self：实现Trait的类型的别名

  self：方法参数 fn f(self) {}，等价于fn f(self: Self) {}

1. 默认实现 

    ```
    trait ${特性}{
    fn 方法(&self){
      ...
      }
    }
    ```
2. Override
    
    覆盖默认实现

3. 无默认实现


4. Orphan rule

5. 泛型约束

  - 
    ``` rust 
    trait Run {
      }
    
    trait Eat {
    }
    
    #[derive(Debug)]
    struct Horse {
    }
    impl Run for Horse {
    }
    impl Eat for Horse {
    }
    fn demo<T: Run + Eat>(x: T) {}
    //如下方式是等价的
    //fn demo<T>(x: T) where T: Run + Eat {}
    ```


  - 泛型约束作用于trait本身
    ``` rust
    trait Learning {}
    trait Teaching: Learning {}

    struct Student {}
    impl Learning for Student {}

    struct Teacher {}
    impl Learning for Teacher {}
    impl Teaching for Teacher {} 
    ```
    表明只有实现了 Learning 的trait类型才能实现 Teaching trait

6. Trait Object

7. Derive

    编译器允许你通过 #[derive] 属性自动实现一些Trait，这些Trait包含：

8. Unsafe Trait
    ```
     unsafe impl Send for Student {}
    ```

9. Impl trait for T 

  例子1

  ``` rust
  mod foo {
    pub trait Zoo {
        fn zoo(&self) {}
    }

    impl<T> Zoo for T {}
  }

  use self::foo::Zoo as _;
  struct Zoo;  // Underscore import avoids name conflict with this item.

  fn main() {
    let z = Zoo;
    z.zoo();
  }
  ```

  例子2

  ``` rust
  struct Yoo;
  struct Xoo;

  pub trait Zoo {
    fn zoo(&self) {
        println!(" zoo ");
    }
  }

  impl<T> Zoo for T {}

  fn main() {
    let z = Yoo;
    z.zoo();

    let x = Xoo;
    x.zoo();

    let m: i32 = 21;
    m.zoo();
  }
  ```
## 参考

- https://zhuanlan.zhihu.com/p/127365605

- https://doc.rust-lang.org/stable/reference/introduction.html
