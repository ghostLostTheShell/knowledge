

# Maybe

`Maybe` 是一个参数化的代数数据类型（ADT），定义在标准库 `Prelude` 中：

```haskell
data Maybe a = Nothing | Just a
```

*   **`a` (Type Variable)**: 这是一个多态类型，表示 `Maybe` 容器里可以装任何类型的数据（如 `Maybe Int`, `Maybe String`）。
*   **`Nothing`**: 空构造器，表示没有值（类似 Null，但类型安全）。
*   **`Just a`**: 值构造器，表示有一个类型为 `a` 的值。

## 1. 核心哲学：显式处理

在 Haskell 中，没有隐式的 `null`。如果一个函数可能不返回结果，它**必须**在类型签名中声明返回 `Maybe`。

*   **类型安全**：你不能把 `Maybe Int` 当作 `Int` 使用。编译器会强制你先“拆包”并处理 `Nothing` 的情况。
*   **纯函数**：它让副作用（如查找失败）在类型层面变得可见。

## 2. 如何使用 Maybe

### A. 构造值
```haskell
val1 :: Maybe Int
val1 = Just 10

val2 :: Maybe Int
val2 = Nothing
```

### B. 提取值（基本方法）

1.  **模式匹配 (Pattern Matching)** - 最常用、最直观：
    ```haskell
    safeDiv :: Int -> Int -> Maybe Int
    safeDiv _ 0 = Nothing
    safeDiv x y = Just (x `div` y)

    -- 使用时：
    case safeDiv 10 0 of
        Just result -> print result
        Nothing     -> print "Division by zero"
    ```

2.  **使用 `maybe` 函数** (折叠操作)：
    `maybe` 接受一个默认值、一个函数和一个 Maybe 值。
    ```haskell
    -- maybe :: b -> (a -> b) -> Maybe a -> b
    result = maybe 0 (*2) (Just 5)  -- 输出 10
    result2 = maybe 0 (*2) Nothing  -- 输出 0
    ```

3.  **使用 `Data.Maybe` 模块的工具函数**：
    *   `fromMybe 0 (Just 5)` -> `5` (提供默认值)
    *   `isJust / isNothing` -> 返回布尔值 (通常不推荐，不如模式匹配常用)
    *   `listToMaybe` / `maybeToList` -> 在列表和 Maybe 间转换

### C. 列表操作中的 Maybe
处理一组可能为空的值时非常有用：
*   `catMaybes`: 去除 `Nothing` 并解包 `Just`。
    `catMaybes [Just 1, Nothing, Just 3] == [1, 3]`
*   `mapMaybe`: 结合 map 和 filter。

## 3. Maybe 作为 Type Classes 的实例

`Maybe` 的强大之处在于它实现了 Haskell 的核心类型类，允许链式操作而无需显式的 `if-else` 或 `case` 检查。

### Functor (可映射)
修改里面的值，如果是 `Nothing` 则保持 `Nothing`。
```haskell
fmap (+1) (Just 1) -- Just 2
fmap (+1) Nothing  -- Nothing
-- 中缀写法
(+1) <$> Just 1
```

### Applicative
将包装在 Maybe 中的函数应用到 Maybe 值上。
```haskell
Just (+1) <*> Just 2 -- Just 3
Just (+1) <*> Nothing -- Nothing
```

### Monad (单子) - **最重要的特性**
用于链式调用一系列可能失败的操作。如果任何一步产生 `Nothing`，整个链条立即返回 `Nothing`（短路机制）。

**场景**：假设有一个字典查找，由于可能找不到，所以返回 `Maybe`。

```haskell
-- 假设 lookup :: String -> [(String, String)] -> Maybe String

-- 使用 do 表示法 (Syntactic Sugar)
getZipCode :: [(String, String)] -> Maybe String
getZipCode userMap = do
    address <- lookup "address" userMap    -- 如果 lookup 失败，直接返回 Nothing
    zipcode <- lookup "zipcode" addressMap -- address 在这里已经解包了
    return zipcode
```
这避免了“回调地狱”或层层嵌套的 `case` 语句。

### Alternative
用于“尝试”机制。如果第一个是 `Nothing`，则取第二个。
```haskell
import Control.Applicative ((<|>))

Just 1 <|> Just 2  -- Just 1
Nothing <|> Just 2 -- Just 2
```

## 4. 与 Either 的对比

*   **Maybe a**: 用于**不需要知道失败原因**的场景（只关心有或没有）。
*   **Either e a**: 用于**需要知道失败原因**的场景（`Left e` 携带错误信息，`Right a` 携带成功值）。

## 总结

Haskell 的 `Maybe a` 是：
1.  **安全的**：通过类型系统强制处理空值。
2.  **可组合的**：利用 Monad 和 Functor 实现优雅的链式调用。
3.  **基础的**：它是 Haskell 处理部分函数（Partial Functions）的标准词汇。