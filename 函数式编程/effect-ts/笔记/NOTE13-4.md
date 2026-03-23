## 1. 高级用法 - 解释

这段文字介绍了 Effect Schema 中**高级扩展能力**：声明新数据类型、品牌类型。这些功能让你能够**扩展 Schema 支持自定义类型**，并为类型添加**语义区分**。

---

## 1.1 声明新的数据类型

### 1.1.1 为什么需要声明新类型？

Effect Schema 内置了常见的类型（String、Number、Date 等），但真实世界的 API 和库可能使用**自定义类型**，比如：

- 浏览器 API 的 `File`、`Blob`
- Node.js 的 `Buffer`
- 第三方库的复杂对象

`Schema.declare` 让你能够为这些类型创建 Schema。

---

### 1.1.2 基础用法：`Schema.declare`

```typescript
import { Schema } from "effect"

// 声明 File 类型的模式
const FileFromSelf = Schema.declare(
  (input: unknown): input is File => input instanceof File
)

// 使用
const decode = Schema.decodeUnknownSync(FileFromSelf)
decode(new File([], ""))  // ✅ 通过
decode(null)               // ❌ 抛出 ParseError
```

**核心**：
- 第一个参数是**类型守卫**：判断输入是否是你想要的类型
- 返回的 Schema 可以像内置 Schema 一样使用

---

### 1.1.3 添加注解（改进错误消息）

```typescript
const FileFromSelf = Schema.declare(
  (input: unknown): input is File => input instanceof File,
  {
    identifier: "FileFromSelf",  // 错误消息中使用这个名字
    description: "The `File` type in JavaScript"
  }
)

decode(null)
// 错误消息: Expected FileFromSelf, actual null
// 而不是: Expected <declaration schema>, actual null
```

| 注解 | 作用 |
|------|------|
| `identifier` | 错误消息中显示的唯一名称 |
| `title` | 简短标题 |
| `description` | 详细描述，用于文档 |

---

### 1.1.4 类型构造函数：泛型类型

为泛型类型创建模式，比如 `ReadonlySet<A>`：

```typescript
export const MyReadonlySet = <A, I, R>(
  item: Schema.Schema<A, I, R>
): Schema.Schema<ReadonlySet<A>, ReadonlySet<I>, R> =>
  Schema.declare(
    [item],  // 存储内部模式
    {
      decode: (item) => (input, parseOptions, ast) => {
        if (input instanceof Set) {
          // 解码每个元素
          const elements = ParseResult.decodeUnknown(Schema.Array(item))(
            Array.from(input.values()),
            parseOptions
          )
          // 返回新的 Set
          return ParseResult.map(elements, (as) => new Set(as))
        }
        return ParseResult.fail(new ParseResult.Type(ast, input))
      },
      encode: (item) => (input, parseOptions, ast) => {
        if (input instanceof Set) {
          // 编码每个元素
          const elements = ParseResult.encodeUnknown(Schema.Array(item))(
            Array.from(input.values()),
            parseOptions
          )
          return ParseResult.map(elements, (is) => new Set(is))
        }
        return ParseResult.fail(new ParseResult.Type(ast, input))
      }
    },
    {
      description: `ReadonlySet<${Schema.format(item)}>`
    }
  )
```

**使用**：
```typescript
const setOfNumbers = MyReadonlySet(Schema.NumberFromString)
decode(setOfNumbers)(new Set(["1", "2", "3"]))  // Set { 1, 2, 3 }
```

---

### 1.1.5 添加编译器注解

当你声明新类型后，其他编译器（如 Arbitrary、Pretty）可能不知道如何处理它。

```typescript
// ❌ 缺少注解，Arbitrary 编译失败
const FileFromSelf = Schema.declare(
  (input): input is File => input instanceof File,
  { identifier: "FileFromSelf" }
)
Arbitrary.make(FileFromSelf)  // 错误：缺少 arbitrary 注解
```

**解决方法**：添加 `arbitrary` 注解

```typescript
const FileFromSelf = Schema.declare(
  (input): input is File => input instanceof File,
  {
    identifier: "FileFromSelf",
    arbitrary: () => (fc) =>
      fc.tuple(fc.string(), fc.string())
        .map(([content, path]) => new File([content], path))
  }
)

Arbitrary.make(FileFromSelf)  // ✅ 现在可以工作了
```

---

## 1.2 品牌类型（Branded Types）

### 1.2.1 问题：结构类型系统的陷阱

TypeScript 是结构类型系统，只要结构相同就认为类型相同：

```typescript
type UserId = string
type Username = string

const userId: UserId = "123"
const username: Username = "456"

// 没有错误！但语义上是错误的
getUser(username)  // 应该用 UserId，却传了 Username
```

### 1.2.2 解决方案：品牌类型

品牌类型通过添加一个"虚拟"标记来区分语义上不同的类型：

```typescript
import { Brand } from "effect"

type UserId = string & Brand.Brand<"UserId">
type Username = string

const userId: UserId = Brand.nominal<UserId>()("123")
const username: Username = "456"

// ❌ 类型错误！UserId 和 Username 不兼容
getUser(username)
```

---

### 1.2.3 方式1：从头创建品牌模式

```typescript
import { Schema } from "effect"

const UserId = Schema.String.pipe(Schema.brand("UserId"))

type UserId = typeof UserId.Type  // string & Brand<"UserId">

// 创建品牌值
const id = UserId.make("123")  // 自动添加品牌标记
```

### 1.2.4 使用唯一符号（避免冲突）

```typescript
const UserIdBrand: unique symbol = Symbol.for("UserId")

const UserId = Schema.String.pipe(Schema.brand(UserIdBrand))

type UserId = typeof UserId.Type  // string & Brand<typeof UserIdBrand>
```

---

### 1.2.5 方式2：重用已有的品牌类型

如果你已经用 `effect/Brand` 定义了品牌类型：

```typescript
import { Brand } from "effect"

// 已有品牌类型
type UserId = string & Brand.Brand<"UserId">
const UserId = Brand.nominal<UserId>()

// 创建 Schema
const UserIdSchema = Schema.String.pipe(Schema.fromBrand(UserId))
```

---

### 1.2.6 品牌类型 vs 过滤器

| 特性 | 过滤器 (filter) | 品牌类型 (brand) |
|------|-----------------|------------------|
| 修改类型 | ❌ 不修改 | ✅ 添加品牌标记 |
| 添加验证 | ✅ 可以 | ✅ 可以 |
| 语义区分 | ❌ 无 | ✅ 有 |

```typescript
// 过滤器：类型不变，只是验证
const LongString = Schema.String.pipe(Schema.minLength(10))
// 类型: string

// 品牌类型：类型改变，添加语义标记
const UserId = Schema.String.pipe(Schema.brand("UserId"))
// 类型: string & Brand<"UserId">
```

---

## 1.3 完整对比表

| 概念 | 用途 | 示例 |
|------|------|------|
| **Schema.declare** | 支持自定义类型 | `Schema.declare(input => input instanceof File)` |
| **类型构造函数** | 泛型类型的模式 | `MyReadonlySet<A>` |
| **编译器注解** | 让 Arbitrary/Pretty 支持自定义类型 | `arbitrary: () => (fc) => ...` |
| **品牌类型** | 语义区分同类结构 | `Schema.String.pipe(Schema.brand("UserId"))` |
| **fromBrand** | 重用已有品牌类型 | `Schema.fromBrand(UserId)` |

---

## 1.4 实际应用场景

### 1.4.1 场景1：支持浏览器 File 类型

```typescript
const FileSchema = Schema.declare(
  (input): input is File => input instanceof File,
  { identifier: "File" }
)

// 用于表单验证
const FormSchema = Schema.Struct({
  name: Schema.String,
  avatar: FileSchema  // 文件上传
})
```

### 1.4.2 场景2：区分不同类型的 ID

```typescript
const UserId = Schema.String.pipe(Schema.brand("UserId"))
const ProductId = Schema.String.pipe(Schema.brand("ProductId"))

// 类型安全：不能混淆
function getUser(id: typeof UserId.Type) { ... }
function getProduct(id: typeof ProductId.Type) { ... }

getUser(UserId.make("123"))     // ✅
getProduct(UserId.make("123"))  // ❌ 类型错误
```

### 1.4.3 场景3：支持自定义集合类型

```typescript
const SetOfNumbers = MyReadonlySet(Schema.Number)
const set = decode(SetOfNumbers)(new Set([1, 2, 3]))
```

---

## 1.5 核心要点总结

> **`Schema.declare` 让你能够支持任何自定义类型，只需提供类型守卫。品牌类型解决了 TypeScript 结构类型系统的局限性，让你能够区分语义上不同的同构类型（如 UserId 和 ProductId）。配合编译器注解，还能让 Arbitrary 等工具自动支持新类型。**

## 2. 属性签名（Property Signatures）- 解释

这段文字详细介绍了 Effect Schema 中**属性签名**的概念和用法。属性签名让你能够**精细控制每个字段的行为**：字段映射、可选性、默认值等。

---

## 2.1 什么是属性签名？

### 2.1.1 核心概念

属性签名表示从"源字段"（输入数据）到"目标字段"（内部模型）的**转换关系**。

```typescript
// 普通结构体：字段名直接对应
const Person = Schema.Struct({
  age: Schema.NumberFromString  // 字段名：age，来源：age
})

// 使用属性签名：可以自定义行为
const Person = Schema.Struct({
  age: Schema.propertySignature(Schema.NumberFromString).annotations({
    title: "Age"
  })
})
```

### 为什么要用属性签名？

| 普通字段 | 属性签名 |
|----------|----------|
| 字段名固定 | 可映射不同字段名 |
| 只能有类型 | 可添加注解、默认值 |
| 无法精细控制可选行为 | 可控制 exact、nullable |

---

## 2.2 PropertySignature 的类型参数

```typescript
PropertySignature<
  ToToken,    // 目标字段是必需还是可选 (":" | "?:")
  ToType,     // 目标字段的类型
  FromKey,    // 源字段的键名（默认是 never，表示同名）
  FromToken,  // 源字段是必需还是可选
  FromType,   // 源字段的类型
  HasDefault, // 是否有默认值
  Context     // 上下文依赖
>
```

### 实际例子

```typescript
const schema = Schema.Struct({
  age: Schema.propertySignature(Schema.NumberFromString)
})
```

`age` 的 PropertySignature 类型是：
```typescript
PropertySignature<":", number, never, ":", string, false, never>
```

| 参数 | 值 | 含义 |
|------|-----|------|
| ToToken | `":"` | 目标字段 age 是必需的 |
| ToType | `number` | 目标字段类型是 number |
| FromKey | `never` | 源字段名也是 age（同名） |
| FromToken | `":"` | 源字段是必需的 |
| FromType | `string` | 源字段类型是 string |
| HasDefault | `false` | 无默认值 |

---

## 2.3 字段映射：`fromKey`

当源字段名与目标字段名不同时使用。

```typescript
const Person = Schema.Struct({
  age: Schema.propertySignature(Schema.NumberFromString).pipe(
    Schema.fromKey("AGE")  // 源字段叫 "AGE"，目标字段叫 "age"
  )
})

decode(Person)({ name: "Alice", AGE: "30" })
// 输出: { name: "Alice", age: 30 }
```

### 映射后的类型变化

```typescript
// 映射前
PropertySignature<":", number, never, ":", string, false, never>

// 映射后（FromKey 从 never 变成了 "AGE"）
PropertySignature<":", number, "AGE", ":", string, false, never>
```

---

## 2.4 可选字段的三种方式

### 2.4.1 基本可选：`optional`

```typescript
Schema.optional(schema)
```

**行为**：
- 字段可以省略
- 可以传 `undefined`（视为省略）
- 编码时省略的字段不出现

```typescript
const schema = Schema.Struct({
  qty: Schema.optional(Schema.NumberFromString)
})

decode({})           // { }
decode({ qty: "1" }) // { qty: 1 }
decode({ qty: undefined }) // { qty: undefined }（编码后出现 undefined）
```

### 2.4.2 可选 + 可空：`{ nullable: true }`

```typescript
Schema.optionalWith(schema, { nullable: true })
```

**行为**：
- `null` 被当作缺失值处理
- `undefined` 也当作缺失值

```typescript
const schema = Schema.Struct({
  qty: Schema.optionalWith(Schema.NumberFromString, { nullable: true })
})

decode({ qty: null })  // {}  ← null 被移除
decode({ qty: undefined })  // {}  ← undefined 也被移除
```

### 2.4.3 可选 + 精确：`{ exact: true }`

```typescript
Schema.optionalWith(schema, { exact: true })
```

**行为**：
- 字段可以省略
- 但不能传 `undefined`（会报错）

```typescript
const schema = Schema.Struct({
  qty: Schema.optionalWith(Schema.NumberFromString, { exact: true })
})

decode({})           // {}  ✅
decode({ qty: "1" }) // { qty: 1 }  ✅
decode({ qty: undefined })  // ❌ 报错！不能传 undefined
```

### 2.4.4 可选 + 可空 + 精确：`{ exact: true, nullable: true }`

```typescript
Schema.optionalWith(schema, { exact: true, nullable: true })
```

**行为**：
- 可以省略
- `null` 被当作缺失值
- `undefined` 报错

```typescript
const schema = Schema.Struct({
  qty: Schema.optionalWith(Schema.NumberFromString, { 
    exact: true, 
    nullable: true 
  })
})

decode({})           // {}  ✅
decode({ qty: null }) // {}  ✅ null 被移除
decode({ qty: undefined })  // ❌ 报错
```

---

## 2.5 四种可选模式对比

| 模式 | 省略字段 | `undefined` | `null` | 编码时 |
|------|----------|-------------|--------|--------|
| `optional` | ✅ | ✅ 保留 | ❌ 不处理 | 保留 |
| `optionalWith(..., { nullable: true })` | ✅ | ✅ 移除 | ✅ 移除 | 移除 |
| `optionalWith(..., { exact: true })` | ✅ | ❌ 报错 | ❌ 不处理 | - |
| `optionalWith(..., { exact: true, nullable: true })` | ✅ | ❌ 报错 | ✅ 移除 | 移除 |

---

## 2.6 默认值

### 基本默认值

```typescript
const schema = Schema.Struct({
  qty: Schema.optionalWith(Schema.NumberFromString, {
    default: () => 1
  })
})

decode({})           // { qty: 1 }  ← 应用默认值
decode({ qty: "2" }) // { qty: 2 }  ← 覆盖默认值
```

### 默认值与精确性

```typescript
// exact: true - 只在字段缺失时应用默认值
const schema = Schema.Struct({
  qty: Schema.optionalWith(Schema.NumberFromString, {
    default: () => 1,
    exact: true
  })
})

decode({})           // { qty: 1 }  ✅
decode({ qty: undefined })  // ❌ 报错，undefined 不被接受
```

### 默认值与可空性

```typescript
// nullable: true - null 也触发默认值
const schema = Schema.Struct({
  qty: Schema.optionalWith(Schema.NumberFromString, {
    default: () => 1,
    nullable: true
  })
})

decode({ qty: null })  // { qty: 1 }  ← null 触发默认值
```

---

## 2.7 `never` 类型的可选字段

### 背景

TypeScript 中 `{ quantity?: never }` 表示"字段不能存在"。

### 两种配置的行为

```typescript
// exactOptionalPropertyTypes: false（默认）
const schema = Schema.Struct({
  qty: Schema.optional(Schema.Never)
})
// 类型: { quantity?: undefined }
// 允许 quantity: undefined

// exactOptionalPropertyTypes: true（推荐）
const schema = Schema.Struct({
  qty: Schema.optionalWith(Schema.Never, { exact: true })
})
// 类型: { quantity?: never }
// 只能完全省略，不能传 undefined
```

---

## 2.8 暴露的值：`from`

```typescript
const schema = Schema.Struct({
  qty: Schema.optional(Schema.NumberFromString)
})

// 访问原始模式（在变为可选之前）
const original = schema.fields.quantity.from  // typeof Schema.NumberFromString
```

---

## 2.9 完整示例：综合使用

```typescript
import { Schema } from "effect"

const Product = Schema.Struct({
  // 必需字段，从 "SKU" 映射
  sku: Schema.propertySignature(Schema.NonEmptyString).pipe(
    Schema.fromKey("SKU")
  ),
  
  // 可选字段，默认值 0
  quantity: Schema.optionalWith(Schema.NumberFromString, {
    default: () => 0
  }),
  
  // 可选字段，不接受 undefined，但接受 null（null 变缺失）
  discount: Schema.optionalWith(Schema.NumberFromString, {
    exact: true,
    nullable: true
  }),
  
  // 带注解
  name: Schema.propertySignature(Schema.NonEmptyString).annotations({
    title: "Product Name",
    description: "The display name of the product"
  })
})

// 使用
const product = Product.make({ 
  SKU: "ABC-123", 
  name: "Widget",
  discount: null  // 会被忽略，因为 nullable: true
})

console.log(product)
// 输出: { sku: 'ABC-123', quantity: 0, name: 'Widget' }
```

---

## 2.10 核心要点总结

> **属性签名让你精细控制每个字段：字段映射（fromKey）、可选性（optional/optionalWith）、默认值（default）、null/undefined 处理（nullable/exact）。通过这些工具，你可以精确描述数据结构与外部数据源的转换关系。**

## 3. 默认值精确性与可空性组合 - 解释

这段文字详细说明了 `optionalWith` 中 **`default`、`exact`、`nullable` 三个选项的组合使用**。理解这些组合对于精确控制字段行为至关重要。

---

## 3.1 三种选项的含义

| 选项 | 含义 | 作用 |
|------|------|------|
| `default: () => A` | 提供默认值 | 当字段缺失或符合条件时，使用默认值 |
| `exact: true` | 精确模式 | 不接受 `undefined`，只有"完全省略"才被视为缺失 |
| `nullable: true` | 可空模式 | `null` 被视为缺失值 |

---

## 3.2 三种组合模式

### 3.2.1 模式1：`exact: true` + 默认值

**行为**：只在字段**完全省略**时应用默认值，`undefined` 会导致错误。

```typescript
const schema = Schema.Struct({
  qty: Schema.optionalWith(Schema.NumberFromString, {
    default: () => 1,
    exact: true
  })
})

// ✅ 字段完全省略 → 应用默认值
decode({})                    // { qty: 1 }

// ✅ 有值 → 不应用默认值
decode({ qty: "2" })          // { qty: 2 }

// ❌ undefined → 报错（不是省略，是显式 undefined）
decode({ qty: undefined })    // ParseError: Expected string, actual undefined
```

**为什么需要这个模式？**

当你需要区分"用户没填"和"用户填了 undefined"时使用。比如表单中，`undefined` 可能是用户清空了输入框，不应该自动填充默认值。

---

### 3.2.2 模式2：`nullable: true` + 默认值

**行为**：`null`、`undefined`、省略都触发默认值。

```typescript
const schema = Schema.Struct({
  qty: Schema.optionalWith(Schema.NumberFromString, {
    default: () => 1,
    nullable: true
  })
})

// ✅ 省略 → 应用默认值
decode({})                    // { qty: 1 }

// ✅ undefined → 应用默认值
decode({ qty: undefined })    // { qty: 1 }

// ✅ null → 应用默认值
decode({ qty: null })         // { qty: 1 }

// ✅ 有值 → 不应用默认值
decode({ qty: "2" })          // { qty: 2 }
```

**为什么需要这个模式？**

当你希望无论字段是省略、`null` 还是 `undefined`，都视为"没有值"并填充默认值时使用。这在处理 API 响应时常见，不同 API 可能用不同方式表示"无值"。

---

### 3.2.3 模式3：`exact: true` + `nullable: true` + 默认值

**行为**：`null` 和省略触发默认值，`undefined` 报错。

```typescript
const schema = Schema.Struct({
  qty: Schema.optionalWith(Schema.NumberFromString, {
    default: () => 1,
    exact: true,
    nullable: true
  })
})

// ✅ 省略 → 应用默认值
decode({})                    // { qty: 1 }

// ✅ null → 应用默认值（null 被视为缺失）
decode({ qty: null })         // { qty: 1 }

// ✅ 有值 → 不应用默认值
decode({ qty: "2" })          // { qty: 2 }

// ❌ undefined → 报错
decode({ qty: undefined })    // ParseError
```

**为什么需要这个模式？**

当你需要区分"用户显式清空（undefined）"和"数据源用 null 表示无值"时使用。这是最严格的模式：只有完全省略和 `null` 被当作"无值"，`undefined` 被视为无效输入。

---

## 3.3 完整对比表

| 输入 | `default` | `exact` | `nullable` | 结果 |
|------|-----------|---------|------------|------|
| 省略 | ✅ | ✅ | - | 应用默认值 |
| `undefined` | ✅ | ✅ | - | ❌ 报错 |
| `null` | ✅ | ✅ | - | ❌ 报错（nullable 未开启）|
| 有值 | ✅ | ✅ | - | 使用提供的值 |

| 输入 | `default` | `nullable` | 结果 |
|------|-----------|------------|------|
| 省略 | ✅ | ✅ | 应用默认值 |
| `undefined` | ✅ | ✅ | 应用默认值 |
| `null` | ✅ | ✅ | 应用默认值 |
| 有值 | ✅ | ✅ | 使用提供的值 |

| 输入 | `default` | `exact` | `nullable` | 结果 |
|------|-----------|---------|------------|------|
| 省略 | ✅ | ✅ | ✅ | 应用默认值 |
| `undefined` | ✅ | ✅ | ✅ | ❌ 报错 |
| `null` | ✅ | ✅ | ✅ | 应用默认值 |
| 有值 | ✅ | ✅ | ✅ | 使用提供的值 |

---

## 3.4 可视化流程图

```
输入值
   │
   ▼
┌─────────────────────────────────────┐
│ 值是 undefined 且 exact: true ?     │
├─────────────────────────────────────┤
│ 是 → 抛出 ParseError（不接受 undefined）│
│ 否 → 继续                          │
└─────────────────────────────────────┘
   │
   ▼
┌─────────────────────────────────────┐
│ 值是 null 且 nullable: true ?       │
├─────────────────────────────────────┤
│ 是 → 视为"缺失"                      │
│ 否 → 使用原值                        │
└─────────────────────────────────────┘
   │
   ▼
┌─────────────────────────────────────┐
│ 值为"缺失"且有 default?              │
├─────────────────────────────────────┤
│ 是 → 应用默认值                      │
│ 否 → 保持缺失                        │
└─────────────────────────────────────┘
```

---

## 3.5 实际应用场景

### 3.4.1 场景1：表单字段默认值（用户未填写）

```typescript
// 用户没填就用默认值，但如果用户删除了已有内容（变成 undefined），
// 不应该填充默认值，应该保持空
const field = Schema.optionalWith(Schema.String, {
  default: () => "默认值",
  exact: true  // undefined 不触发默认值，保持空
})

// 用户从未填写 → {}
// 用户填写并删除 → { field: undefined }（编码后可能变成 {}）
// 用户填写了 → { field: "用户输入" }
```

### 3.4.2 场景2：API 响应规范化

```typescript
// API 可能返回 null 或省略字段，都视为无值，填充默认值
// 但如果 API 明确返回 undefined（通常不会发生），也视为无值
const apiField = Schema.optionalWith(Schema.Number, {
  default: () => 0,
  nullable: true  // null 触发默认值
})

// API 返回 {} → 0
// API 返回 { field: null } → 0
// API 返回 { field: 5 } → 5
```

### 3.4.3 场景3：严格区分空值类型

```typescript
// 数据库字段：NULL 表示"无值"，undefined 表示"不更新"
// 省略字段表示"不更新"，null 表示"设为 NULL"
const dbField = Schema.optionalWith(Schema.String, {
  default: () => "DEFAULT",
  exact: true,
  nullable: true
})

// 不传字段 → 不更新（保持原值）
// { field: null } → 设为 NULL
// { field: "new" } → 更新为新值
// { field: undefined } → 报错（不应该出现）
```

---

## 3.6 核心要点总结

> **`default` 决定用什么值填充缺失；`exact` 决定 `undefined` 是否算缺失；`nullable` 决定 `null` 是否算缺失。组合使用可以精确控制什么情况下应用默认值，什么情况下报错。**

## 4. 作为 Option 的可选字段 - 解释

这段文字介绍了如何将可选字段**显式表示为 `Option` 类型**，以及相关的原语操作。这是处理"可能有也可能没有"的值的最佳实践。

---

## 4.1 为什么用 Option 而不是 undefined/null？

| 方式 | 问题 |
|------|------|
| `undefined` / `null` | 无法区分"字段不存在"和"字段存在但值为空" |
| `Option` | 显式表达：`Some` = 有值，`None` = 无值 |

```typescript
// ❌ 不明确
type Person = {
  name?: string  // 是没填还是填了空字符串？
}

// ✅ 明确
type Person = {
  name: Option<string>  // Some("") 表示填了空，None 表示没填
}
```

---

## 4.2 四种 Option 模式

### 4.2.1 模式1：基本 Option（`as: "Option"`）

```typescript
const schema = Schema.Struct({
  qty: Schema.optionalWith(Schema.NumberFromString, { as: "Option" })
})
```

**行为**：
- 输入缺失或 `undefined` → 输出 `Option.none()`
- 输入有值 → 输出 `Option.some(值)`

```typescript
decode({})                // { qty: None }
decode({ qty: undefined }) // { qty: None }
decode({ qty: "2" })       // { qty: Some(2) }

encode({ qty: None })      // {}（字段省略）
encode({ qty: Some(2) })   // { qty: "2" }
```

**类型变化**：
```typescript
// 编码类型
type Encoded = { qty?: string | undefined }

// 解码类型（你的业务类型）
type Type = { qty: Option<number> }
```

---

### 4.2.2 模式2：Option + 精确性（`exact: true`）

```typescript
const schema = Schema.Struct({
  qty: Schema.optionalWith(Schema.NumberFromString, { 
    as: "Option", 
    exact: true 
  })
})
```

**行为**：
- 输入缺失 → 输出 `Option.none()`
- 输入 `undefined` → ❌ 报错
- 输入有值 → 输出 `Option.some(值)`

```typescript
decode({})                // { qty: None } ✅
decode({ qty: "2" })       // { qty: Some(2) } ✅
decode({ qty: undefined }) // ❌ ParseError
```

**类型变化**：
```typescript
type Encoded = { qty?: string }  // 没有 undefined
type Type = { qty: Option<number> }
```

---

### 4.2.3 模式3：Option + 可空性（`nullable: true`）

```typescript
const schema = Schema.Struct({
  qty: Schema.optionalWith(Schema.NumberFromString, { 
    as: "Option", 
    nullable: true 
  })
})
```

**行为**：
- 输入缺失、`undefined`、`null` → 都输出 `Option.none()`
- 输入有值 → 输出 `Option.some(值)`

```typescript
decode({})                // { qty: None }
decode({ qty: undefined }) // { qty: None }
decode({ qty: null })      // { qty: None }
decode({ qty: "2" })       // { qty: Some(2) }
```

**类型变化**：
```typescript
type Encoded = { qty?: string | null | undefined }
type Type = { qty: Option<number> }
```

---

### 4.2.4 模式4：Option + 精确性 + 可空性

```typescript
const schema = Schema.Struct({
  qty: Schema.optionalWith(Schema.NumberFromString, { 
    as: "Option", 
    exact: true, 
    nullable: true 
  })
})
```

**行为**：
- 输入缺失 → 输出 `Option.none()`
- 输入 `null` → 输出 `Option.none()`
- 输入 `undefined` → ❌ 报错
- 输入有值 → 输出 `Option.some(值)`

```typescript
decode({})                // { qty: None } ✅
decode({ qty: null })      // { qty: None } ✅
decode({ qty: "2" })       // { qty: Some(2) } ✅
decode({ qty: undefined }) // ❌ ParseError
```

**类型变化**：
```typescript
type Encoded = { qty?: string | null }  // 没有 undefined
type Type = { qty: Option<number> }
```

---

## 4.3 四种 Option 模式对比

| 模式 | 输入省略 | `undefined` | `null` | 有值 |
|------|----------|-------------|--------|------|
| **基础 Option** | `None` | `None` | ❌ 不处理 | `Some` |
| **+ exact** | `None` | ❌ 报错 | ❌ 不处理 | `Some` |
| **+ nullable** | `None` | `None` | `None` | `Some` |
| **+ exact + nullable** | `None` | ❌ 报错 | `None` | `Some` |

---

## 4.4 `optionalToOptional` - 可选字段转换

### 用途

当你需要在两个可选字段之间转换，并且可以**自定义转换逻辑**时使用。

### 语法

```typescript
optionalToOptional(
  fromSchema,  // 输入模式
  toSchema,    // 输出模式
  {
    decode: (Option<From>) => Option<To>,
    encode: (Option<To>) => Option<From>
  }
)
```

### 示例：过滤空字符串

```typescript
const schema = Schema.Struct({
  nonEmpty: Schema.optionalToOptional(
    Schema.String,   // 输入：string
    Schema.String,   // 输出：string
    {
      // 输入 Option<string> → 输出 Option<string>
      decode: (maybeString) => {
        if (Option.isNone(maybeString)) return Option.none()
        const value = maybeString.value
        if (value === "") return Option.none()  // 空字符串 → None
        return Option.some(value)
      },
      encode: (maybeString) => maybeString  // 编码不变
    }
  )
})

// 测试
decode({})                     // {}
decode({ nonEmpty: "" })        // {}（空字符串被过滤）
decode({ nonEmpty: "hello" })   // { nonEmpty: "hello" }
```

### 使用 `Option.filter` 简化

```typescript
const schema = Schema.Struct({
  nonEmpty: Schema.optionalToOptional(
    Schema.String,
    Schema.String,
    {
      decode: Option.filter((s) => s !== ""),  // 空字符串 → None
      encode: identity
    }
  )
})
```

---

## 4.5 完整对比：所有可选字段处理方式

| 处理方式 | 输入省略 | `undefined` | `null` | 输出类型 |
|----------|----------|-------------|--------|----------|
| `optional` | 省略 | `undefined` | 原值 | `T \| undefined` |
| `optionalWith(..., { nullable: true })` | 省略 | `undefined` | 省略 | `T \| undefined` |
| `optionalWith(..., { exact: true })` | 省略 | ❌ 报错 | 原值 | `T?`（无 undefined）|
| `optionalWith(..., { as: "Option" })` | `None` | `None` | ❌ 报错 | `Option<T>` |
| `optionalWith(..., { as: "Option", exact: true })` | `None` | ❌ 报错 | ❌ 报错 | `Option<T>` |
| `optionalWith(..., { as: "Option", nullable: true })` | `None` | `None` | `None` | `Option<T>` |
| `optionalToOptional` | 自定义 | 自定义 | 自定义 | 自定义 |

---

## 4.6 选择指南

| 场景 | 推荐方式 |
|------|----------|
| 简单可选，不关心 undefined/null | `optional` |
| 需要区分"未提供"和"提供了 undefined" | `optionalWith(..., { exact: true })` |
| null 表示无值 | `optionalWith(..., { nullable: true })` |
| 需要显式表达"有/无" | `optionalWith(..., { as: "Option" })` |
| 需要自定义转换逻辑 | `optionalToOptional` |
| 需要过滤特定值（如空字符串） | `optionalToOptional` + `Option.filter` |

---

## 4.7 核心要点总结

> **使用 `as: "Option"` 将可选字段转换为显式的 `Option` 类型，可以清晰地区分"有值"和"无值"。结合 `exact` 和 `nullable` 可以精确控制哪些输入被视为"无值"。`optionalToOptional` 提供了完全自定义的可选字段转换能力。**

## 5. `optionalToRequired` - 解释

这段文字介绍了 `optionalToRequired` API，它让你能够**将可选字段转换为必需字段**，同时提供自定义逻辑来处理输入中字段缺失的情况。

---

## 5.1 为什么需要 `optionalToRequired`？

### 问题场景

你有一个外部数据源，其中某个字段是**可选的**（可能不存在），但你的内部模型需要这个字段是**必需的**（总是有值）。

```typescript
// 外部 API 返回的数据（可选）
type ApiData = {
  discount?: string  // 折扣可能不存在
}

// 你的内部模型（必需）
type InternalData = {
  discount: number | null  // 必须有一个值（0 或 null 或数字）
}
```

`optionalToRequired` 帮你处理这种转换。

---

## 5.2 核心概念

### 签名解读

```typescript
optionalToRequired(
  from: Schema<FA, FI, FR>,  // 输入模式（可选）
  to: Schema<TA, TI, TR>,    // 输出模式（必需）
  options: {
    decode: (o: Option<FA>) => TI,    // Option<输入类型> → 输出类型
    encode: (ti: TI) => Option<FA>    // 输出类型 → Option<输入类型>
  }
): PropertySignature<":", TA, never, "?:", FI, false, ...>
```

**关键点**：
- **输入**：`Option<FA>` — 输入字段可能是 `Some(值)` 或 `None`（缺失）
- **输出**：`TI` — 输出字段必须是具体值（不能是 Option）
- 方向：**可选输入 → 必需输出**

---

## 5.3 示例解析：为缺失字段设置 `null` 默认值

```typescript
const schema = Schema.Struct({
  nullable: Schema.optionalToRequired(
    Schema.String,              // 输入：可选字符串
    Schema.NullOr(Schema.String), // 输出：string | null
    {
      decode: (maybeString) => {
        if (Option.isNone(maybeString)) {
          return null  // 输入缺失 → 输出 null
        }
        return maybeString.value  // 输入有值 → 输出原值
      },
      encode: (stringOrNull) => {
        if (stringOrNull === null) {
          return Option.none()  // 输出 null → 输入省略（不传）
        }
        return Option.some(stringOrNull)  // 输出有值 → 输入有值
      }
    }
  )
})
```

### 解码流程

| 输入 | 解码结果 |
|------|----------|
| `{}` | `{ nullable: null }` |
| `{ nullable: "hello" }` | `{ nullable: "hello" }` |
| `{ nullable: null }` | 输入 null 会被 `Schema.String` 拒绝 |

### 编码流程

| 编码输入 | 输出 |
|----------|------|
| `{ nullable: null }` | `{}`（null 被省略）|
| `{ nullable: "hello" }` | `{ nullable: "hello" }` |

---

## 5.4 简化版：使用 `Option.getOrElse` 和 `Option.liftPredicate`

```typescript
const schema = Schema.Struct({
  nullable: Schema.optionalToRequired(
    Schema.String,
    Schema.NullOr(Schema.String),
    {
      decode: Option.getOrElse(() => null),      // None → null
      encode: Option.liftPredicate((value) => value !== null)  // null → None
    }
  )
})
```

### 工具函数解释

| 函数 | 作用 |
|------|------|
| `Option.getOrElse(() => defaultValue)` | 如果 `None`，返回默认值；如果 `Some`，返回值 |
| `Option.liftPredicate(predicate)` | 如果满足谓词，返回 `Some`；否则返回 `None` |

---

## 5.5 完整流程图

```
                   解码方向
输入（可选）─────────────────→ 输出（必需）
                   
{} ──────────────────────────→ { nullable: null }
   (None)                         (null)

{ nullable: "hello" } ─────────→ { nullable: "hello" }
   (Some("hello"))                ("hello")


                   编码方向
输出（必需）─────────────────→ 输入（可选）

{ nullable: null } ───────────→ {}
   (null)                          (None)

{ nullable: "hello" } ─────────→ { nullable: "hello" }
   ("hello")                       (Some("hello"))
```

---

## 5.6 与其他 API 的对比

| API | 输入类型 | 输出类型 | 用途 |
|-----|----------|----------|------|
| `optional` | 可选 | 可选 | 简单传递 |
| `optionalWith(..., { default })` | 可选 | 必需（有默认值） | 填充默认值 |
| `optionalToRequired` | 可选 | 必需（自定义） | 自定义转换 |
| `requiredToOptional` | 必需 | 可选 | 反向转换 |

---

## 5.7 实际应用场景

### 4.4.1 场景1：API 响应规范化

```typescript
// API 可能不返回 discount 字段，你的模型需要 null
const Discount = Schema.optionalToRequired(
  Schema.NumberFromString,      // API 可能返回 "10" 或不返回
  Schema.NullOr(Schema.Number), // 模型需要 number | null
  {
    decode: Option.getOrElse(() => null),
    encode: Option.liftPredicate((v) => v !== null)
  }
)
```

### 4.4.2 场景2：表单默认值

```typescript
// 用户可能没填备注，系统需要空字符串而不是 undefined
const Notes = Schema.optionalToRequired(
  Schema.String,
  Schema.String,
  {
    decode: Option.getOrElse(() => ""),  // 没填 → 空字符串
    encode: (s) => s === "" ? Option.none() : Option.some(s)  // 空字符串不传
  }
)
```

### 4.4.3 场景3：布尔值默认

```typescript
// 用户可能没勾选同意条款，系统需要 false
const Agreed = Schema.optionalToRequired(
  Schema.Literal("yes"),
  Schema.Boolean,
  {
    decode: Option.isSome,  // 存在 → true，不存在 → false
    encode: (b) => b ? Option.some("yes") : Option.none()
  }
)
```

---

## 5.8 核心要点总结

> **`optionalToRequired` 将可选字段转换为必需字段。`decode` 接收 `Option`（可能是 None），返回必需值；`encode` 接收必需值，返回 `Option`（None 表示输出时省略）。`Option.getOrElse` 和 `Option.liftPredicate` 是简化此类转换的常用工具。**

## 6. `requiredToOptional` - 解释

这段文字介绍了 `requiredToOptional` API，它是 `optionalToRequired` 的**反向操作**：让你能够将**必需字段转换为可选字段**，同时提供自定义逻辑来确定何时可以省略该字段。

---

## 6.1 为什么需要 `requiredToOptional`？

### 问题场景

你的内部模型有一个**必需字段**，但外部数据源期望这个字段是**可选的**（可能不需要发送）。

```typescript
// 你的内部模型（必需）
type InternalData = {
  name: string  // 必须有值
}

// 外部 API 期望的数据（可选）
type ApiData = {
  name?: string  // 可能不需要发送
}
```

`requiredToOptional` 帮你处理这种转换，特别是当某些值（如空字符串）应该被视为"不发送"时。

---

## 6.2 核心概念

### 签名解读

```typescript
requiredToOptional(
  from: Schema<FA, FI, FR>,  // 输入模式（必需）
  to: Schema<TA, TI, TR>,    // 输出模式（可选）
  options: {
    decode: (fa: FA) => Option<TI>,    // 必需输入 → Option<输出类型>
    encode: (o: Option<TI>) => FA      // Option<输出类型> → 必需输出
  }
): PropertySignature<"?:", TA, never, ":", FI, false, ...>
```

**关键点**：
- **输入**：`FA` — 必需值（总是存在）
- **输出**：`Option<TI>` — 可能被省略（`None`）或有值（`Some`）
- 方向：**必需输入 → 可选输出**

---

## 6.3 示例解析：将空字符串视为缺失值

```typescript
const schema = Schema.Struct({
  name: Schema.requiredToOptional(
    Schema.String,  // 输入：必需字符串
    Schema.String,  // 输出：可选字符串
    {
      decode: (string) => {
        if (string === "") {
          return Option.none()  // 空字符串 → 省略
        }
        return Option.some(string)  // 非空 → 保留
      },
      encode: (maybeString) => {
        if (Option.isNone(maybeString)) {
          return ""  // 输出省略 → 输入用空字符串
        }
        return maybeString.value  // 输出有值 → 输入原值
      }
    }
  )
})
```

### 解码流程

| 输入 | 解码结果 |
|------|----------|
| `{ name: "John" }` | `{ name: "John" }` |
| `{ name: "" }` | `{}`（空字符串被省略）|

### 编码流程

| 编码输入 | 输出 |
|----------|------|
| `{ name: "John" }` | `{ name: "John" }` |
| `{}` | `{ name: "" }`（省略 → 空字符串）|

---

## 6.4 简化版：使用 `Option.liftPredicate` 和 `Option.getOrElse`

```typescript
const schema = Schema.Struct({
  name: Schema.requiredToOptional(
    Schema.String,
    Schema.String,
    {
      decode: Option.liftPredicate((s) => s !== ""),  // 空字符串 → None
      encode: Option.getOrElse(() => "")              // None → 空字符串
    }
  )
})
```

### 工具函数解释

| 函数 | 作用 |
|------|------|
| `Option.liftPredicate(predicate)` | 如果满足谓词，返回 `Some(值)`；否则返回 `None` |
| `Option.getOrElse(() => defaultValue)` | 如果 `None`，返回默认值；如果 `Some`，返回值 |

---

## 6.5 完整流程图

```
                   解码方向
输入（必需）─────────────────→ 输出（可选）

{ name: "John" } ────────────→ { name: "John" }
   ("John")                       (Some("John"))

{ name: "" } ─────────────────→ {}
   ("")                            (None)


                   编码方向
输出（可选）─────────────────→ 输入（必需）

{ name: "John" } ────────────→ { name: "John" }
   (Some("John"))                 ("John")

{} ─────────────────────────→ { name: "" }
   (None)                         ("")
```

---

## 6.6 `optionalToRequired` vs `requiredToOptional` 对比

| 特性 | `optionalToRequired` | `requiredToOptional` |
|------|---------------------|---------------------|
| 输入 | 可选（`Option`） | 必需（具体值） |
| 输出 | 必需（具体值） | 可选（`Option`） |
| `decode` | `Option<FA> → TI` | `FA → Option<TI>` |
| `encode` | `TI → Option<FA>` | `Option<TI> → FA` |
| 用途 | 填充默认值 | 过滤"无意义"的值 |

**记忆技巧**：
- `optionalToRequired`：**可选变必需**，需要填补缺失
- `requiredToOptional`：**必需变可选**，可以过滤掉某些值

---

## 6.7 实际应用场景

### 5.4.1 场景1：过滤空字符串

```typescript
// 内部模型有 name，但空字符串不应该发送给 API
const Name = Schema.requiredToOptional(
  Schema.String,
  Schema.String,
  {
    decode: Option.liftPredicate((s) => s !== ""),
    encode: Option.getOrElse(() => "")
  }
)
```

### 5.4.2 场景2：过滤零值

```typescript
// 内部模型有 discount，但 0 可能表示"没有折扣"，不发送
const Discount = Schema.requiredToOptional(
  Schema.Number,
  Schema.Number,
  {
    decode: Option.liftPredicate((n) => n !== 0),
    encode: Option.getOrElse(() => 0)
  }
)

// 解码：discount = 0 → 字段省略
// 编码：字段省略 → discount = 0
```

### 5.4.3 场景3：过滤假值

```typescript
// 只发送真值，假值（false、0、空字符串）不发送
const Flag = Schema.requiredToOptional(
  Schema.Boolean,
  Schema.Boolean,
  {
    decode: Option.liftPredicate((b) => b === true),
    encode: Option.getOrElse(() => false)
  }
)

// 解码：true → 保留；false → 省略
// 编码：存在 → true；省略 → false
```

### 5.4.4 场景4：条件过滤

```typescript
// 只发送超过阈值的值
const Score = Schema.requiredToOptional(
  Schema.Number,
  Schema.Number,
  {
    decode: (score) => score > 60 ? Option.some(score) : Option.none(),
    encode: Option.getOrElse(() => 0)
  }
)

// 解码：>60 保留，≤60 省略
// 编码：有值 → 原值，省略 → 0
```

---

## 6.8 与 `optionalWith` 的对比

| 功能 | `optionalWith` | `requiredToOptional` |
|------|---------------|---------------------|
| 可选性控制 | ✅ 控制输入可选性 | ✅ 控制输出可选性 |
| 默认值 | ✅ 支持 | ✅ 支持（通过 `encode`）|
| 自定义过滤逻辑 | ❌ 只有内置 | ✅ 完全自定义 |
| 适用场景 | 输入验证 | 输出序列化 |

---

## 6.9 核心要点总结

> **`requiredToOptional` 将必需字段转换为可选字段。`decode` 接收必需值，返回 `Option`（`None` 表示输出时省略）；`encode` 接收 `Option`，返回必需值（`None` 时返回默认值）。`Option.liftPredicate` 和 `Option.getOrElse` 是简化此类转换的常用工具。**

## 7. 扩展模式、重命名属性、递归模式 - 解释

这段文字介绍了 Effect Schema 中三个重要的高级主题：**模式扩展**、**属性重命名**和**递归模式定义**。

---

## 7.1 扩展模式

### 7.1.1 为什么需要扩展模式？

在开发中，你经常需要：
- 在已有模式基础上添加新字段
- 合并多个模式的字段
- 用联合类型扩展结构体

Effect Schema 提供了两种主要方式：**字段扩展**和 **`extend` 函数**。

---

### 7.1.2 字段扩展（Spreading Struct Fields）

使用 `...Struct.fields` 可以保留原始的 `Struct` 类型，继续访问 `fields` 属性。

#### 添加新字段

```typescript
const Original = Schema.Struct({
  a: Schema.String,
  b: Schema.String
})

const Extended = Schema.Struct({
  ...Original.fields,  // 展开原有字段
  c: Schema.String,     // 添加新字段
  d: Schema.String
})

// 类型: { a: string; b: string; c: string; d: string }
```

#### 添加索引签名

```typescript
const Original = Schema.Struct({
  a: Schema.String,
  b: Schema.String
})

const Extended = Schema.Struct(
  Original.fields,
  Schema.Record({ key: Schema.String, value: Schema.String })
)

// 类型: { a: string; b: string; [x: string]: string }
```

#### 合并多个结构体

```typescript
const Struct1 = Schema.Struct({ a: Schema.String, b: Schema.String })
const Struct2 = Schema.Struct({ c: Schema.String, d: Schema.String })

const Extended = Schema.Struct({
  ...Struct1.fields,
  ...Struct2.fields
})

// 类型: { a: string; b: string; c: string; d: string }
```

---

### 7.1.3 `Schema.extend` 函数

当字段扩展不够用时（如用联合类型扩展结构体），使用 `Schema.extend`。

#### 示例：用结构体的联合扩展结构体

```typescript
const Struct = Schema.Struct({ a: Schema.String })

const UnionOfStructs = Schema.Union(
  Schema.Struct({ b: Schema.String }),
  Schema.Struct({ c: Schema.String })
)

const Extended = Schema.extend(Struct, UnionOfStructs)

// 类型: { a: string } & ({ b: string } | { c: string })
```

#### 冲突处理

当字段类型冲突时，会报错：

```typescript
const Struct = Schema.Struct({ a: Schema.String })
const Overlapping = Schema.Union(
  Schema.Struct({ a: Schema.Number }),  // 冲突：string vs number
  Schema.Struct({ d: Schema.String })
)

Schema.extend(Struct, Overlapping)  // ❌ 错误：cannot extend string with number
```

#### 扩展精炼

```typescript
const Integer = Schema.Int.pipe(Schema.brand("Int"))
const Positive = Schema.Positive.pipe(Schema.brand("Positive"))

// 组合两个精炼：正数 + 整数
const PositiveInteger = Schema.extend(Positive, Integer)

// 现在同时要求正数和整数
decode(PositiveInteger)(-1)   // ❌ 不是正数
decode(PositiveInteger)(1.1)  // ❌ 不是整数
decode(PositiveInteger)(5)    // ✅
```

---

## 7.2 重命名属性

### 7.2.1 定义时重命名：`fromKey`

```typescript
// 必需字段重命名
const schema = Schema.Struct({
  a: Schema.propertySignature(Schema.String).pipe(
    Schema.fromKey("c")  // 源字段叫 "c"，目标字段叫 "a"
  ),
  b: Schema.Number
})

decode({ c: "hello", b: 1 })  // { a: "hello", b: 1 }
```

```typescript
// 可选字段重命名
const schema = Schema.Struct({
  a: Schema.optional(Schema.String).pipe(Schema.fromKey("c")),
  b: Schema.Number
})

decode({ c: "hello", b: 1 })  // { a: "hello", b: 1 }
decode({ b: 1 })                // { b: 1 }
```

### 7.2.2 现有模式重命名：`rename`

```typescript
const Original = Schema.Struct({
  c: Schema.String,
  b: Schema.Number
})

// 将 "c" 重命名为 "a"
const Renamed = Schema.rename(Original, { c: "a" })

decode(Renamed)({ c: "hello", b: 1 })  // { a: "hello", b: 1 }
```

#### 对联合使用

```typescript
const Original = Schema.Union(
  Schema.Struct({ c: Schema.String, b: Schema.Number }),
  Schema.Struct({ c: Schema.String, d: Schema.Boolean })
)

// 为所有成员重命名
const Renamed = Schema.rename(Original, { c: "a" })

// 类型: { a: string; b: number } | { a: string; d: boolean }
```

---

## 7.3 递归模式

### 7.3.1 自引用模式：`Schema.suspend`

```typescript
interface Category {
  readonly name: string
  readonly subcategories: ReadonlyArray<Category>
}

const Category = Schema.Struct({
  name: Schema.String,
  subcategories: Schema.Array(
    Schema.suspend((): Schema.Schema<Category> => Category)  // 延迟引用
  )
})
```

**为什么需要 `suspend`？**
因为 `Category` 在定义时引用自身，直接引用会导致无限循环。`suspend` 延迟求值，打破循环。

---

### 7.3.2 简化递归模式定义的技巧

将递归字段与非递归字段分开：

```typescript
const fields = {
  name: Schema.String
  // 其他非递归字段
}

interface Category extends Schema.Struct.Type<typeof fields> {
  readonly subcategories: ReadonlyArray<Category>
}

const Category = Schema.Struct({
  ...fields,
  subcategories: Schema.Array(
    Schema.suspend((): Schema.Schema<Category> => Category)
  )
})
```

---

### 7.3.3 互递归模式

两个模式相互引用：

```typescript
interface Expression {
  readonly type: "expression"
  readonly value: number | Operation
}

interface Operation {
  readonly type: "operation"
  readonly operator: "+" | "-"
  readonly left: Expression
  readonly right: Expression
}

const Expression = Schema.Struct({
  type: Schema.Literal("expression"),
  value: Schema.Union(
    Schema.Number,
    Schema.suspend((): Schema.Schema<Operation> => Operation)
  )
})

const Operation = Schema.Struct({
  type: Schema.Literal("operation"),
  operator: Schema.Literal("+", "-"),
  left: Expression,
  right: Expression
})
```

---

### 7.3.4 Type 和 Encoded 不同的递归模式

当递归字段的 `Type` 和 `Encoded` 不同时，需要两个接口：

```typescript
const fields = {
  id: Schema.NumberFromString,  // Type: number, Encoded: string
  name: Schema.String
}

// Type 接口（解码后）
interface Category extends Schema.Struct.Type<typeof fields> {
  readonly subcategories: ReadonlyArray<Category>
}

// Encoded 接口（编码后）
interface CategoryEncoded extends Schema.Struct.Encoded<typeof fields> {
  readonly subcategories: ReadonlyArray<CategoryEncoded>
}

const Category = Schema.Struct({
  ...fields,
  subcategories: Schema.Array(
    Schema.suspend(
      (): Schema.Schema<Category, CategoryEncoded> => Category
    )
  )
})
```

---

## 7.4 总结对比

| 操作 | 方式 | 适用场景 |
|------|------|----------|
| **添加字段** | `{ ...fields, newField }` | 简单扩展 |
| **合并结构体** | `{ ...fields1, ...fields2 }` | 组合多个模式 |
| **添加索引签名** | `Struct(fields, record)` | 动态属性 |
| **用联合扩展** | `Schema.extend` | 复杂扩展 |
| **扩展精炼** | `Schema.extend` | 组合约束 |
| **定义时重命名** | `fromKey` | 字段映射 |
| **现有模式重命名** | `Schema.rename` | 批量重命名 |
| **递归模式** | `Schema.suspend` | 树形结构 |

---

## 7.5 核心要点总结

> **字段扩展让你在保留原始 `Struct` 类型的同时添加/合并字段；`extend` 函数支持更复杂的扩展（如用联合扩展）；`fromKey` 和 `rename` 提供字段重命名能力；`suspend` 是定义递归和互递归模式的必要工具。**