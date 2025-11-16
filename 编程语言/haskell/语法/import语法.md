# **Haskell `import` 用法总结**

Haskell 的 `import` 用来引入模块，并可选择性地导入、隐藏或重命名内容。

---

## **基本导入**

```haskell
import Data.List
```

* 导入整个模块所有导出的名称。
* 若与其他模块冲突需提供限定名或隐藏。

---

## **限定导入（qualified）**

```haskell
import qualified Data.Map
```

* 所有名称必须以模块名前缀使用：

```haskell
Data.Map.lookup ...
```

### 自定义别名

```haskell
import qualified Data.Map as M
```

* 推荐写法，减少冗长：

```haskell
M.lookup ...
```

---

## **选择性导入（import only）**

只导入想要的名称：

```haskell
import Data.List (sort, nub)
```

---

## **选择性隐藏（hide）**

隐藏某些名称：

```haskell
import Data.List hiding (nub)
```

=> `Data.List` 中除了 `nub` 其它都导入。

---

## **结合 qualified + 选择性导入**

```haskell
import qualified Data.Map as M (lookup, insert)
```

只导入 `lookup`、`insert` 且必须用 `M.` 调用。

---

## **导入实例（不允许选择或隐藏）**

类型类实例不能选择性导入，只能全部导入：

```haskell
import Data.Monoid ()
```

* `()` 表示“不导入任何名称”，但实例会被加载。
* 常用于只想加载某实例但不想污染命名空间。

---

## **模块重命名（as）**

```haskell
import Data.ByteString as BS
```

---

## **隐式导入（Prelude）**

* 默认自动导入 `Prelude`
* 可手动禁止：

```haskell
import Prelude ()
```

→ 完全不导入任何 Prelude 名称。

---


| 写法                              | 含义          |
| ------------------------------- | ----------- |
| `import M`                      | 导入整个模块      |
| `import qualified M`            | 模块名称必须加前缀使用 |
| `import qualified M as X`       | 模块重命名       |
| `import M (a,b,c)`              | 仅导入指定符号     |
| `import M hiding (x,y)`         | 隐藏指定符号      |
| `import qualified M as X (a,b)` | 限定+选择性导入    |
| `import M ()`                   | 不导入名称，只加载实例 |
| `import Prelude ()`             | 禁用 Prelude  |

---

