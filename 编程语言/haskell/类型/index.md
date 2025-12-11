## 1.类型（Type）
类型 = 一类值的集合。
比如 Int 是整数集合，Bool 是 {True, False} 的集合。

## 1.1 定义代数数据类型（algebraic data type，ADT）

**语法**

```haskell
data 类型名 = 构造子1 类型1 类型2 ...
             | 构造子2 类型1 ...
             | 构造子3

```
- 类型名（Type Name）：新类型的名字。

- 构造子（Constructor）：类似“类的实例模板”，用来生成这个类型的值。

- 类型字段（Field types）：构造子里每个位置的值的类型。

---

**和类型**（Sum type）：多个构造子（二选一/多选一）

```haskell
data Color = Red | Green | Blue
```

**积类型**（Product type）：把多个字段装在一起

```haskell
data Person = Person String Int
-- Person 是类型名，也是构造子名。
-- 它有两个类型的字段。 一个是String 一个是 Int

-- 构造一个值：
p :: Person
p = Person "小猫" 5
let desc = case p of
    Person a b -> "name:" ++ show(a) + ", age:"++ show(b)
-- desc = "name:小猫, age:5"
```

**带类型参数的类型**

```haskell
data Maybe a = Nothing | Just a
data Either e a = Left e | Right a

```

**记录语法（Named Fields）**
可以给构造子字段命名，方便访问：

```haskell
data Person = Person { name :: String, age :: Int }

p :: Person
p = Person { name = "Alice", age = 30 }

-- 取值
personName = name p  -- "Alice"

```


## 1.2 定义类型别名
```haskell
type Name = String
type Age = Int
```

## 2. 类型类（Type class）
类型类 = 一组行为（接口）/一套函数的约束。
它本质上是“接口 + ad-hoc 多态”。

```haskell
class Eq a where
    (==) :: a -> a -> Bool

```