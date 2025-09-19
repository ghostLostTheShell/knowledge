# use

[ 作用 ]

 - 用于引用某个外部模块

 - 直接使用枚举值，而无需手动加上作用域

 - 为某个作用域下的方法或作用域创建别名



## 

引用外部模块使用案例

1.

``` rust
pub mod modA{
  pub a:i8 = 10;
  pub b:i8 = 10;
  pub c:i8 = 10;
  pub e:i8 = 10;
  pub f:i8 = 10;
}

use modA::{a,b,c};
use modA::e;
use modA::f as w;// 别名



```

2. 导入全部外部模块

  *运算符用于将所有项目放入范围,这也称为glob运算符
```rust
pub mod modA{
  pub a:i8 = 10;
  pub b:i8 = 10;
  pub c:i8 = 10;
}
use modA::*;

fn main() {
    println!("{}, {}, {}", a, b, c);
}
```

3. 从当前模块访问父模块

``` rust
mod a{  
    fn x() -> u8 {  
        5  
    }  

    pub mod example {  
        use super::x;  //使用父模块

        pub fn foo() {  
            println!("{}",x());  
        }  
    }
}  

fn main()  
{  
  a::example::foo();  
}
```
