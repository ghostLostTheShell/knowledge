

### 什么是Effect Schema?

一个让你**定义数据格式（类型）**，然后**自动获得一系列验证、转换、生成等功能**的工具库。


###  `Schema<Type, Encoded, Requirements>` 三个类型参数的含义?

#### 1. `Type` —— 你想要的数据类型

这是**解码之后**你实际使用的类型。是你希望在业务逻辑中操作的类型。

```typescript
// 例子：你希望用 Date 对象
Schema<Date, ...>  // Type = Date
```

#### 2. `Encoded` —— 数据存储/传输时的类型

这是数据在**外部系统**中的格式（API响应、数据库存储、用户输入）。

```typescript
// 例子：API 返回的是 ISO 字符串
Schema<Date, string>  // Encoded = string
```

#### 3. `Requirements` —— 解码/编码所需的依赖

有些解码操作需要外部依赖（比如网络请求、数据库查询）。这个参数用来追踪这些依赖。

```typescript
// 例子：需要数据库连接才能解码
Schema<User, unknown, DatabaseConnection>  // Requirements = DatabaseConnection
```

---

### 为什么要区分 Type 和 Encoded？

这是 Effect Schema 的核心设计理念：**数据在边界需要转换**。

```
外部世界                边界                   内部世界
─────────              ────                   ─────────
API返回:               decode                 业务代码使用:
{ name: "Alice",       ──────>                { name: "Alice", 
  age: "30" }                   转换           age: 30 }

存储到数据库:          encode                 业务代码修改:
{ name: "Alice",       <──────                 { name: "Alice", 
  age: 30 }               转换                 age: 30 }
```

**好处**：
- 业务代码只关心 `Type`（你想要的格式）
- 边界适配交给 Schema（API格式、数据库格式）
- 两者解耦，互不影响

---

### 为什么需要 Requirements？

有些转换不是纯函数，需要外部依赖：

```typescript
// 例子：从ID解码成用户
const UserFromId = Schema.transformOrFail(
  Schema.String,        // 输入：用户ID字符串
  Schema.User,          // 输出：用户对象
  {
    decode: (id) =>
      Effect.gen(function* () {
        const db = yield* Database  // 需要数据库连接
        const user = yield* db.findUser(id)
        return user
      }),
    encode: (user) => Effect.succeed(user.id)
  }
)

// 这个 Schema 的类型是：
// Schema<User, string, Database>
//                    ↑         ↑
//               Encoded    Requirements
```

Requirements 会被 Effect 系统追踪，确保在运行前所有依赖都被正确提供。

---



### 类型参数缩写

```typescript
Schema<Type, Encoded, Requirements>
// 简写为
Schema<A, I, R>
```

| 缩写 | 全称 | 含义 |
|------|------|------|
| **A** | Type | 解码后的类型（你想用的） |
| **I** | Input/Encoded | 编码后的类型（外部格式） |
| **R** | Requirements | 所需依赖 |

**为什么用缩写？** 在 Effect 生态系统中，这是约定俗成的命名惯例，让代码更简洁。

---

### Schema 值的三个特性

#### 1. 不可变性

```typescript
const original = Schema.String
const modified = original.pipe(Schema.minLength(3))

// original 没有被改变，modified 是一个新 Schema
```

**为什么重要？** 你可以安全地复用、组合、扩展 Schema，不会意外影响其他地方。

#### 2. 建模数据结构

Schema 本身**不执行任何操作**，它只是一个"蓝图"或"说明书"。

```typescript
const Person = Schema.Struct({
  name: Schema.String,
  age: Schema.Number
})

// Person 只是一个描述，不会自动验证任何数据
// 你需要用 decode/encode 函数才能让它工作
```

类比：建筑图纸本身不会盖房子，但工人可以根据图纸施工。

#### 3. 由编译器解释

同一个 Schema 可以被不同的"编译器"用来生成不同的功能：

| 编译器 | 功能 |
|--------|------|
| `decode` | 验证和转换数据 |
| `encode` | 反向转换 |
| `is` | 类型守卫 |
| `arbitrary` | 生成随机测试数据 |
| `pretty` | 美化打印 |
| `jsonSchema` | 生成 JSON Schema 文档 |

**一个 Schema，多种用途**。

---

### 理解解码和编码

#### 核心思想

```
外部世界（不可信） → 解码 → 内部世界（可信）
内部世界（可信） → 编码 → 外部世界（所需格式）
```

#### 具体例子：前端表单

用户输入：`{ age: "30" }`（字符串）
你想用的：`{ age: 30 }`（数字）

```typescript
const schema = Schema.Struct({
  age: Schema.NumberFromString  // 自动把字符串转数字
})

// 解码：表单数据 → 业务对象
const user = decode(schema)({ age: "30" })  // { age: 30 }

// 编码：业务对象 → 表单数据
const formData = encode(schema)({ age: 30 })  // { age: "30" }
```

### `Schema<Date, string>` 的例子

```typescript
const DateSchema = Schema.Date  // 实际上是 Schema<Date, string>
```

#### 解码过程（string → Date）

```
输入: "2024-01-01T00:00:00.000Z" (string)
  ↓
1. 检查：这是字符串吗？ ✅
2. 解码：转换成 Date 对象
  ↓
输出: Date 对象
```

#### 编码过程（Date → string）

```
输入: new Date("2024-01-01") (Date 对象)
  ↓
1. 检查：这是 Date 吗？ ✅
2. 编码：转换成 ISO 字符串
  ↓
输出: "2024-01-01T00:00:00.000Z"
```

---

### 模式的规则：往返一致性

这是**最重要的规则**：

> `encode(decode(value))` 应该等于原始值
> `decode(encode(value))` 也应该等于原始值

#### 正确示例

```typescript
const DateSchema = Schema.Date

const original = "2024-01-01T00:00:00.000Z"
const decoded = decode(DateSchema)(original)  // Date 对象
const encoded = encode(DateSchema)(decoded)   // 字符串

console.log(encoded === original)  // true ✅
```

#### 错误示例（违反规则）

```typescript
// 假设有一个只保留年份的 Date 转换
const YearOnly = Schema.transform(
  Schema.String,
  Schema.Date,
  {
    decode: (s) => new Date(s + "-01-01"),  // 只取年份，忽略月份
    encode: (d) => d.getFullYear().toString()
  }
)

const original = "2024-06-15"
const decoded = decode(YearOnly)(original)  // 2024-01-01
const encoded = encode(YearOnly)(decoded)   // "2024"

console.log(encoded === original)  // false ❌ 丢失了信息
```

#### 为什么这个规则重要？

1. **可预测性**：知道编解码不会意外改变数据
2. **可逆性**：可以在两种格式间来回转换
3. **数据完整性**：不会丢失信息

---

### 双向转换契约的理念

> **Schema 定义了一个"双向转换契约"：外部格式与内部格式可以互相转换，且往返后数据不变。**