#

## 

## 2.调用语法

### 2.1 前缀调用（标准语法）

**语法**
```haskell
-- 基本形式：函数名 参数1 参数2 ...
function arg1 arg2 arg3
```

示例

```haskell
add x y = x + y
result = add 3 4        -- 7

-- 带模块前缀
import Data.List
sorted = sort [3,1,4,2]  -- [1,2,3,4]
```

### 2.2 中缀函数调用

**语法**
```haskell

-- 基本形式：参数1 `函数` 参数2
arg1 `function` arg2

```

示例
```haskell

-- 示例
result = 3 `add` 4      -- 等价于 add 3 4

-- 常用场景
3 `elem` [1,2,3,4]      -- True
"hello" `isPrefixOf` "hello world"  -- True
```

### 2.3 运算符调用（内置中缀）
```haskell

-- 运算符本身就是中缀的
3 + 4                   -- 7
True && False           -- False
"hello" ++ " world"     -- "hello world"
```

**操作符切片:**

中缀操作符，可以通过用括号包围它们来转换成前缀函数。

- (*) 等价于 \x y -> x * y 这个函数。



## 2.4 函数组合调用 (. 操作符)

从右向左，把小函数串联成大函数，让数据像流过管道一样被处理。

**定义**

它的数学定义是：$(f \circ g)(x) = f(g(x))$。

在 Haskell 中：
```haskell
(f . g) x = f (g x)
```

例子:

```haskell
processList = show . sum . take 5
processList [1, 2, 3, 4, 5, 6, 7] -- "15"
```

## 2.5 函数应用符($ 操作符)
在 Haskell 中，$ 操作符被称为 “函数应用符” (Function Application Operator)。

**作用:**

在 Haskell 中，普通的函数调用（用空格隔开）拥有最高优先级 (10)，并且是左结合的。
这意味着 f g h x 会被解析为 (((f g) h) x)。
如果你想表达“先把右边的算完，再传给左边”，通常需要写括号。

不使用 $ (括号地狱):

```haskell
putStrLn (show (1 + (2 * 3))) -- 7
```

使用 $ (清晰易读):

```haskell
putStrLn $ show $ 1 + 2 * 3
```
所有在 $ 右边的东西，先算完，算出一个结果后，再传给 $ 左边的函数

特性

- $ 优先级为0（最低）
- 右结合性





