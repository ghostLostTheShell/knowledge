

### 什么是Effect Schema?

一个让你**定义数据格式（类型）**，然后**自动获得一系列验证、转换、生成等功能**的工具库。


### 什么是 `Schema<Type, Encoded, Requirements>`？

这是模式的核心类型，包含三个参数：

| 参数 | 含义 | 类比 |
|------|------|------|
| **Type** | 你实际想要的数据类型 | 比如你想用 `Date` 对象 |
| **Encoded** | 数据在外部系统/传输时的格式 | 比如 API 返回的是字符串 `"2024-01-01"` |
| **Requirements** | 解码/编码需要的外部依赖 | 比如需要数据库连接或网络请求 |

### 为什么要区分 Type 和 Encoded？

因为外部数据（API、数据库、用户输入）往往不是你想要的形式：

```
外部数据 → 解码 → 内部数据
(字符串)    (转换)   (Date对象)
```

- **解码**：把"外部格式"转成"你想要的格式"
- **编码**：反过来，把你想要的格式转成外部格式

## 表格中的操作是什么意思？

| 操作 | 通俗解释 |
|------|----------|
| **解码** | 把 API 返回的 JSON 字符串转成真正的 TypeScript 对象 |
| **编码** | 把你改完的数据转回 API 能接受的格式 |
| **断言** | 运行时检查一个值是否符合类型，不符合就报错 |
| **标准模式** | 生成符合业界标准（如 Standard Schema v1）的验证器 |
| **任意值生成** | 自动生成随机测试数据（比如测试 100 个随机的 Person 对象） |
| **JSON 模式** | 从你的定义自动生成 JSON Schema 文档 |
| **等价性** | 提供比较两个值是否相等的方法 |
| **美化打印** | 把数据格式化成易读的字符串（比如缩进、换行） |

## 简单例子

```typescript
import { Schema } from "effect"

// 定义：name 是字符串，age 是数字（但输入可能是字符串）
const Person = Schema.Struct({
  name: Schema.String,
  age: Schema.NumberFromString  // 自动把字符串转成数字
})

// 解码：API 返回的 { name: "Alice", age: "30" } 
// 变成   { name: "Alice", age: 30 }
const alice = Schema.decodeUnknownSync(Person)({ name: "Alice", age: "30" })

// 美化打印：把对象打印成易读格式
console.log(Pretty.make(Person)(alice))  // 输出格式化的 JSON
```