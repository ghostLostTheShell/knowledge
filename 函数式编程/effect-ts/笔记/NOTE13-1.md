
### 1. 两种导入方式

#### 1.1 命名空间导入

```typescript
import * as Schema from "effect/Schema"
```

**特点**：
- 所有功能都挂在 `Schema` 对象下
- 使用时：`Schema.String`、`Schema.Struct`、`Schema.Number`

**适合**：喜欢显式命名空间的开发者

---

#### 1.2 命名导入

```typescript
import { Schema } from "effect"
```

**特点**：
- 从核心 `effect` 包导入（更常用）
- 使用时同样：`Schema.String`、`Schema.Struct`、`Schema.Number`

**区别**：`effect` 包导出的是聚合后的 Schema 模块，本质上是一样的。

---

### 2. 定义第一个模式：`Schema.Struct`

```typescript
const Person = Schema.Struct({
  name: Schema.String,
  age: Schema.Number
})
```

#### 2.1 Schema.Struct 是什么？

`Struct` 是用于定义**对象结构**的构造函数。它告诉 TypeScript 和运行时：

> 我有一个对象，它有两个属性：
> - `name`：必须是字符串
> - `age`：必须是数字

#### 2.2 翻译成人话

```typescript
// 你写的代码
const Person = Schema.Struct({
  name: Schema.String,   // name 字段：字符串类型
  age: Schema.Number     // age 字段：数字类型
})

// 相当于告诉 TypeScript
interface Person {
  name: string
  age: number
}
```

---

### 2.3 `Schema.String` 和 `Schema.Number` 是什么？

它们是 Effect Schema 提供的**内置基础模式**：

| 内置模式 | 对应的 TypeScript 类型 |
|----------|----------------------|
| `Schema.String` | `string` |
| `Schema.Number` | `number` |
| `Schema.Boolean` | `boolean` |
| `Schema.Date` | `Date` |
| ... | ... |

每个内置模式都是一个**预定义的验证器/转换器**。

---

### 2.4 这个模式能做什么？

定义好 `Person` 后，你就可以用它来：

#### 2.4.1 解码（验证 + 转换）

```typescript
// 验证 API 返回的数据
const apiData = { name: "Alice", age: "30" }  // age 是字符串！

// 使用 decodeUnknown 验证并转换
const person = Schema.decodeUnknownSync(Person)(apiData)
// person = { name: "Alice", age: 30 }  ← age 变成了数字
```

#### 2.4.2 编码（反向转换）

```typescript
// 把业务对象转回 API 格式
const person = { name: "Alice", age: 30 }
const apiReady = Schema.encodeSync(Person)(person)
// apiReady = { name: "Alice", age: 30 }  ← 没有变化，因为没有转换
```

#### 2.4.3 类型推断

```typescript
// 自动推断出 TypeScript 类型
type PersonType = typeof Person.Type
// 等价于：
type PersonType = {
  readonly name: string
  readonly age: number
}
```

#### 2.4.4 生成 JSON Schema

```typescript
import { JSONSchema } from "effect"

const jsonSchema = JSONSchema.make(Person)
// 自动生成 JSON Schema 文档
```

#### 2.4.5 生成随机测试数据

```typescript
import { Arbitrary } from "effect"

const arb = Arbitrary.make(Person)
// 可以生成随机 Person 对象用于测试
```

### 2.5 实际使用流程

```typescript
import { Schema } from "effect"

// 1. 定义模式
const Person = Schema.Struct({
  name: Schema.String,
  age: Schema.Number
})

// 2. 使用模式
const data = { name: "Alice", age: 30 }

// 3. 验证（不转换）
const isValid = Schema.is(Person)(data)  // true

// 4. 解码（验证 + 转换）
const decoded = Schema.decodeSync(Person)(data)

// 5. 编码（反向转换）
const encoded = Schema.encodeSync(Person)(decoded)
```
## 2.6 Schema.Struct 核心要点

> **`Schema.Struct` 让你用声明式的方式定义对象结构，然后自动获得类型推断、数据验证、格式转换、文档生成等一系列能力。**


---

## 3. 为什么要提取类型？

定义模式后，你可能需要在代码中使用它的类型：

```typescript
const Person = Schema.Struct({
  name: Schema.String,
  age: Schema.Number
})

// 你希望得到这样的类型：
type Person = {
  name: string
  age: number
}
```

Effect Schema 提供了工具让你自动提取这个类型，而不需要手动重复定义。

---

### 3.1 提取 Type（解码后的类型）

#### 3.1.1 两种方式

```typescript
// 方式1：使用 Schema.Type 工具类型
type Person1 = Schema.Schema.Type<typeof Person>

// 方式2：直接访问 Type 字段
type Person2 = typeof Person.Type
```

**两者结果完全一样**：

```typescript
type Person = {
  readonly name: string
  readonly age: number
}
```

#### 3.1.2 注意：属性是 `readonly` 的

默认情况下，提取出来的类型属性都是只读的（`readonly`），这符合函数式编程的不可变理念。

---

### 3.2 Type vs Encoded 的区别

这是理解 Effect Schema 的关键！

| 概念 | 含义 | 例子 |
|------|------|------|
| **Type** | 解码后你使用的类型 | `number` |
| **Encoded** | 编码后存储/传输的格式 | `string` |

#### 实际例子

```typescript
const Person = Schema.Struct({
  name: Schema.String,           // String: Type = string, Encoded = string
  age: Schema.NumberFromString   // NumberFromString: Type = number, Encoded = string
})
```

**提取结果对比**：

```typescript
// Type（你使用的）
type Person = {
  name: string
  age: number      // ← 数字！
}

// Encoded（存储/传输的）
type PersonEncoded = {
  name: string
  age: string      // ← 字符串！
}
```

---

### 3.3 两种提取方式的对比

#### 方式1：使用 `interface` 扩展

```typescript
interface Person extends Schema.Schema.Type<typeof Person> {}
```

**优点**：
- 性能更好（TypeScript 处理 `interface` 比 `type` 更高效）
- 可以继续扩展
- 错误信息更清晰

**适合**：需要导出供外部使用的公共类型

#### 方式2：使用 `type` 别名

```typescript
type Person = Schema.Schema.Type<typeof Person>
```

**优点**：
- 更简洁
- 可以组合更复杂的类型

**适合**：内部使用的类型

---

### 3.4 提取 Encoded 类型的时机

什么时候需要提取 Encoded 类型？

#### 场景1：处理 API 响应

```typescript
// API 返回的是 Encoded 格式
const apiResponse: PersonEncoded = {
  name: "Alice",
  age: "30"    // 字符串！
}

// 解码成 Type 格式
const person = Schema.decodeSync(Person)(apiResponse)
```

#### 场景2：准备发送给 API 的数据

```typescript
// 业务代码使用 Type 格式
const person: Person = {
  name: "Alice",
  age: 30      // 数字
}

// 编码成 API 需要的 Encoded 格式
const apiData = Schema.encodeSync(Person)(person)
// apiData.age 是 "30"（字符串）
```

---

### 3.5 完整示例

```typescript
import { Schema } from "effect"

// 定义模式（Type 和 Encoded 不同）
const Person = Schema.Struct({
  name: Schema.String,
  age: Schema.NumberFromString  // string ↔ number
})

// 提取类型
type Person = Schema.Schema.Type<typeof Person>
type PersonEncoded = Schema.Schema.Encoded<typeof Person>

// 使用
const apiData: PersonEncoded = { name: "Alice", age: "30" }

// 解码
const person: Person = Schema.decodeSync(Person)(apiData)
console.log(person.age)  // 30（数字）

// 编码
const toApi: PersonEncoded = Schema.encodeSync(Person)(person)
console.log(toApi.age)   // "30"（字符串）
```

### 3.6 核心要点

> **Type 是你想要的，Encoded 是外部给你的。通过提取这两种类型，你可以在编译时就知道数据在哪个阶段是什么格式，避免运行时类型错误。**

## 4. Context、Opaque、不透明类型、只读与解码函数

---

### 4.1 Context（上下文依赖）

#### 4.1.1 是什么？

`Context` 表示模式在执行解码/编码时需要的**外部依赖**。

```typescript
Schema<Type, Encoded, Context>
//                       ↑
//                  需要的依赖
```

#### 4.1.2 为什么需要 Context？

有些解码操作不是纯函数，需要外部资源：

| 场景 | 需要的依赖 |
|------|-----------|
| 从数据库查数据 | 数据库连接 |
| 调用 API 验证 | HTTP 客户端 |
| 读取配置文件 | 配置服务 |

#### 4.1.3 提取 Context 类型

```typescript
const Person = Schema.Struct({
  name: Schema.String,
  age: Schema.Number
})

// 两种方式提取 Context
type PersonContext = Schema.Schema.Context<typeof Person>
type PersonContext2 = typeof Person.Context
```

在这个例子中，`Person` 没有依赖，所以 `Context` 是 `never`。

#### 4.1.4 有依赖的例子

```typescript
// 假设有一个需要数据库连接的模式
const UserFromDb = Schema.transformOrFail(
  Schema.String,           // 输入：用户ID
  Schema.User,             // 输出：用户对象
  {
    decode: (id) => Effect.gen(function* () {
      const db = yield* Database  // 需要 Database 服务
      return yield* db.findUser(id)
    }),
    encode: (user) => Effect.succeed(user.id)
  }
)

// 这个模式的 Context 是 Database
type UserContext = typeof UserFromDb.Context  // Database
```

---

### 4.2 不透明类型（Opaque Types）

#### 4.2.1 是什么？

不透明类型是**隐藏内部结构，只暴露类型名称**的模式。这让你可以：

1. 隐藏实现细节
2. 防止外部直接操作内部结构
3. 提供更好的封装

#### 4.2.2 为什么要用不透明类型？

```typescript
// 没有不透明类型：外部可以随意访问内部结构
const Person = Schema.Struct({
  name: Schema.String,
  age: Schema.Number
})

// 外部代码可以：
type PersonType = typeof Person.Type  // { name: string; age: number }
// 外部知道了所有字段结构
```

```typescript
// 使用不透明类型：外部只知道有 Person 类型，不知道内部结构
interface Person extends Schema.Schema.Type<typeof _Person> {}
const Person: Schema.Schema<Person> = _Person

// 外部只能：
type PersonType = Person  // 只知道是 Person，不知道具体字段
```

#### 4.2.3 创建不透明类型的步骤

**简单情况（Type = Encoded）：**

```typescript
// 1. 定义内部模式
const _Person = Schema.Struct({
  name: Schema.String,
  age: Schema.Number
})

// 2. 定义不透明接口
interface Person extends Schema.Schema.Type<typeof _Person> {}

// 3. 重新声明为不透明模式
const Person: Schema.Schema<Person> = _Person
```

**复杂情况（Type ≠ Encoded）：**

当 `Type` 和 `Encoded` 不同时，需要两个接口：

```typescript
// 1. 定义内部模式
const _Person = Schema.Struct({
  name: Schema.String,
  age: Schema.NumberFromString  // 注意：Type=number, Encoded=string
})

// 2. 定义两个不透明接口
interface Person extends Schema.Schema.Type<typeof _Person> {}      // Type
interface PersonEncoded extends Schema.Schema.Encoded<typeof _Person> {}  // Encoded

// 3. 重新声明为不透明模式
const Person: Schema.Schema<Person, PersonEncoded> = _Person
```

---

### 4.3 默认只读类型

Effect Schema 默认生成的类型属性是**只读（readonly）**的：

```typescript
const Person = Schema.Struct({
  name: Schema.String,
  age: Schema.Number
})

// 推断出的类型
type Person = {
  readonly name: string  // ← 只读
  readonly age: number   // ← 只读
}
```

#### 4.3.1 为什么默认只读？

- **不可变性**：函数式编程的核心原则
- **类型安全**：防止意外修改
- **可预测性**：数据流更清晰

#### 4.3.2 如果需要可变类型

```typescript
// 使用 mutable 函数
const MutablePerson = Schema.mutable(Person)

// 或直接使用类型工具
type MutablePerson = {
  -readonly [K in keyof Person]: Person[K]
}
```

---

### 4.4 解码函数

Effect Schema 提供了多种解码函数，处理不同的使用场景：

| 函数 | 返回类型 | 适用场景 |
|------|----------|----------|
| `decodeUnknownSync` | 直接返回值或抛出错误 | 简单场景，相信数据会正确 |
| `decodeUnknownOption` | `Option<A>` | 可能失败，需要优雅处理 |
| `decodeUnknownEither` | `Either<ParseError, A>` | 需要知道失败原因 |
| `decodeUnknownPromise` | `Promise<A>` | 异步场景 |
| `decodeUnknown` | `Effect<A, ParseError>` | 需要 Effect 的完整能力 |

#### `decodeUnknownSync` 详解

```typescript
const Person = Schema.Struct({
  name: Schema.String,
  age: Schema.Number
})

// 正确输入：直接返回
const valid = Schema.decodeUnknownSync(Person)({ name: "Alice", age: 30 })
// valid = { name: "Alice", age: 30 }

// 错误输入：抛出 ParseError
const invalid = Schema.decodeUnknownSync(Person)(null)
// 抛出: ParseError: Expected { ... }, actual null
```

#### 为什么叫 `decodeUnknown`？

- **decode**：从外部格式转换为内部格式
- **Unknown**：输入类型是 `unknown`（TypeScript 的顶级类型）

#### 其他解码函数的对比

```typescript
import { Schema, Option, Either, Effect } from "effect"

const Person = Schema.Struct({
  name: Schema.String,
  age: Schema.Number
})

const decodeSync = Schema.decodeUnknownSync(Person)
const decodeOption = Schema.decodeUnknownOption(Person)
const decodeEither = Schema.decodeUnknownEither(Person)
const decodeEffect = Schema.decodeUnknown(Person)

// decodeSync：失败就抛异常
try {
  const result = decodeSync(null)
} catch (e) {
  console.error(e)  // 捕获异常
}

// decodeOption：失败返回 None
const result1 = decodeOption(null)
if (Option.isSome(result1)) {
  console.log(result1.value)
} else {
  console.log("解码失败")
}

// decodeEither：失败返回 Left（包含错误信息）
const result2 = decodeEither(null)
if (Either.isRight(result2)) {
  console.log(result2.right)
} else {
  console.log(result2.left.message)  // 可以拿到具体错误信息
}

// decodeEffect：返回 Effect，可以组合、重试等
const program = decodeEffect(null)
Effect.runPromise(program).catch(e => console.error(e))
```

**核心理念**：Effect Schema 让你在定义模式时就能考虑数据类型、依赖关系、封装性和错误处理，实现"一次定义，全面考虑"。

## 5. 不同解码/编码方式，错误处理与解析选项


### 5.1 `decodeUnknownEither` - 安全的错误处理

#### 5.1.1 为什么需要 `decodeUnknownEither`？

`decodeUnknownSync` 在失败时会**抛出异常**，这有时不是你想要的：
- 你可能想优雅地处理错误，而不是让程序崩溃
- 你可能需要知道**为什么**失败，而不仅仅是"失败了"

#### 5.1.2 `Either` 是什么？

`Either` 是一个表示"两种可能结果"的类型：

```typescript
Either<L, R>
// 要么是 Left（失败，包含错误信息）
// 要么是 Right（成功，包含成功值）
```

#### 5.1.3 实际使用

```typescript
import { Schema, Either } from "effect"

const Person = Schema.Struct({
  name: Schema.String,
  age: Schema.Number
})

const decode = Schema.decodeUnknownEither(Person)

// 成功的情况
const result1 = decode({ name: "Alice", age: 30 })
if (Either.isRight(result1)) {
  console.log(result1.right)  // { name: "Alice", age: 30 }
}

// 失败的情况
const result2 = decode(null)
if (Either.isLeft(result2)) {
  console.log(result2.left)   // ParseError 对象，包含详细错误信息
}
```

**关键点**：你不会看到 `try/catch`，而是通过 `if` 判断是成功还是失败，这是一种更函数式的错误处理方式。

---

### 5.2 `decodeUnknown` - 异步解码

#### 5.2.1 为什么需要 `decodeUnknown`？

有些解码操作是**异步**的：
- 从数据库查询数据
- 调用 API 验证
- 读取文件

`decodeUnknownSync` 和 `decodeUnknownEither` 都是**同步**的，无法处理异步操作。

#### 5.2.2 异步解码的例子

```typescript
import { Schema, Effect } from "effect"

// 这个模式需要异步转换
const asyncSchema = Schema.transformOrFail(
  Schema.Number,     // 输入：数字ID
  Person,            // 输出：Person对象
  {
    decode: (id) =>
      // 模拟异步操作（如数据库查询）
      Effect.succeed({ id, name: "name", age: 18 }).pipe(
        Effect.delay("10 millis")  // 延迟10毫秒
      ),
    encode: (person) =>
      Effect.succeed(person.id).pipe(Effect.delay("10 millis"))
  }
)

// ❌ 错误：不能用同步方式解码异步操作
Schema.decodeUnknownEither(asyncSchema)(1)
// 返回 Left，提示"cannot be resolved synchronously"

// ✅ 正确：用 decodeUnknown 返回 Effect
const program = Schema.decodeUnknown(asyncSchema)(1)
Effect.runPromise(program).then(console.log)
// 输出: { id: 1, name: 'name', age: 18 }
```

#### 5.2.3 解码函数对比

| 函数 | 适用场景 | 返回值 |
|------|----------|--------|
| `decodeUnknownSync` | 同步，确定会成功 | 直接值 |
| `decodeUnknownEither` | 同步，可能失败 | `Either<ParseError, A>` |
| `decodeUnknown` | 同步或异步，可能失败 | `Effect<A, ParseError>` |

---

### 5.3 编码函数

编码函数与解码函数是对称的，只是方向相反：

| 编码函数 | 对应解码函数 | 说明 |
|----------|-------------|------|
| `encodeSync` | `decodeUnknownSync` | 同步编码，失败抛异常 |
| `encodeEither` | `decodeUnknownEither` | 同步编码，返回 Either |
| `encode` | `decodeUnknown` | 支持异步，返回 Effect |

#### 编码示例

```typescript
const Person = Schema.Struct({
  name: Schema.NonEmptyString,
  age: Schema.NumberFromString  // 注意：Type=number, Encoded=string
})

// 编码：数字 → 字符串
console.log(Schema.encodeSync(Person)({ name: "Alice", age: 30 }))
// 输出: { name: 'Alice', age: '30' }  ← age 变成了字符串

// 编码失败：name 是空字符串
Schema.encodeSync(Person)({ name: "", age: 30 })
// 抛出 ParseError，提示 "Expected a non empty string"
```

---

### 5.4 `Forbidden` - 禁止编码

#### 5.4.1 什么时候需要？

有时你**只想要单向转换**，比如：
- 密码哈希：可以加密，但不能解密
- 敏感数据：可以验证输入，但不能反向输出

#### 5.4.2 实现方式

```typescript
import { Either, ParseResult, Schema } from "effect"

const SafeDecode = <A, I>(self: Schema.Schema<A, I, never>) => {
  const decodeUnknownEither = Schema.decodeUnknownEither(self)
  return Schema.transformOrFail(
    Schema.Unknown,
    Schema.EitherFromSelf({
      left: Schema.Unknown,
      right: Schema.typeSchema(self)
    }),
    {
      strict: true,
      // 解码：总是成功，失败时包装成 Left
      decode: (input) =>
        ParseResult.succeed(
          Either.mapLeft(decodeUnknownEither(input), () => input)
        ),
      // 编码：只允许编码 Right 值
      encode: (actual, _, ast) =>
        Either.match(actual, {
          onLeft: () =>
            ParseResult.fail(
              new ParseResult.Forbidden(
                ast,
                actual,
                "cannot encode a Left"
              )
            ),
          onRight: ParseResult.succeed
        })
    }
  )
}
```

**效果**：
- 解码时：永远不失败，成功值变成 `Right`，失败值变成 `Left`（包含原始输入）
- 编码时：`Right` 可以编码，`Left` 被禁止并返回 `Forbidden` 错误

---

### 5.5 `ParseError` - 解析错误

所有解码/编码函数的错误最终都是 `ParseError`：

```typescript
interface ParseError {
  readonly _tag: "ParseError"  // 标签，便于类型判断
  readonly issue: ParseIssue   // 具体错误信息
}
```

`ParseIssue` 可以是：
- `Type`：类型不匹配
- `Missing`：缺少字段
- `Unexpected`：多余字段
- `Refinement`：精炼失败
- `Transformation`：转换失败
- 等等

---

### 5.6 解析选项

#### 5.6.1 `onExcessProperty` - 处理多余属性

| 选项值 | 行为 |
|--------|------|
| `"ignore"`（默认） | 忽略多余属性，只输出定义好的字段 |
| `"error"` | 遇到多余属性时抛出错误 |
| `"preserve"` | 保留多余属性到输出中 |

```typescript
const Person = Schema.Struct({
  name: Schema.String,
  age: Schema.Number
})

// 默认：忽略 email
decode({ name: "Bob", age: 40, email: "bob@example.com" })
// 输出: { name: 'Bob', age: 40 }

// error：报错
decode({ name: "Bob", age: 40, email: "bob@example.com" }, 
       { onExcessProperty: "error" })
// 抛出 ParseError: ["email"] is unexpected

// preserve：保留
decode({ name: "Bob", age: 40, email: "bob@example.com" }, 
       { onExcessProperty: "preserve" })
// 输出: { email: 'bob@example.com', name: 'Bob', age: 40 }
```

---

### 5.7 总结对比

| 功能 | 函数/选项 | 作用 |
|------|----------|------|
| **同步解码（抛异常）** | `decodeUnknownSync` | 最简单，失败就抛 |
| **同步解码（不抛异常）** | `decodeUnknownEither` | 返回 `Either`，优雅处理 |
| **异步解码** | `decodeUnknown` | 返回 `Effect`，支持异步 |
| **同步编码** | `encodeSync` | 类似解码 |
| **禁止编码** | `Forbidden` | 单向转换 |
| **多余属性处理** | `onExcessProperty` | `"ignore"`/`"error"`/`"preserve"` |
| **返回所有错误** | `errors: "all"` | 默认只返回第一个错误 |

---

### 5.7.1 核心要点

> **Effect Schema 提供了多种解码/编码方式，让你可以根据场景选择：简单场景用 `Sync`，需要错误信息用 `Either`，异步操作用 `Effect`，需要严格控制用 `ParseOptions`。**

## 6. 解析选项、类型守卫和断言 - 解释

这段文字涵盖了 Effect Schema 中**高级解析控制**的多个方面：**错误收集**、**属性顺序控制**、**嵌套解析配置**、**类型守卫**和**断言**。

---

### 6.1 接收所有错误（`errors: "all"`）

#### 6.1.1 默认行为 vs 全错误模式

```typescript
// 默认：只返回第一个错误
decode(data, { errors: "first" })  // 只报告 age 错误，email 被忽略

// 全错误模式：返回所有错误
decode(data, { errors: "all" })     // 报告 age 和 email 所有错误
```

#### 6.1.2 为什么需要全错误模式？

| 场景 | 为什么需要 |
|------|-----------|
| 表单验证 | 一次性显示所有字段的错误，而不是逐个修复 |
| API 响应验证 | 了解整个响应的所有问题，便于调试 |
| 批量数据校验 | 一次性收集所有无效数据 |

#### 6.1.3 实际例子

```typescript
const data = {
  name: "Bob",
  age: "abc",           // 错误1：应该是数字
  email: "bob@example.com"  // 错误2：多余字段（因为 onExcessProperty: "error"）
}

// 输出显示两个错误
ParseError: { readonly name: string; readonly age: number }
├─ ["email"]           ← 错误1
│  └─ is unexpected
└─ ["age"]             ← 错误2
   └─ Expected number, actual "abc"
```

---

### 6.2 管理属性顺序（`propertyOrder`）

#### 6.2.1 为什么属性顺序重要？

在 JavaScript 中，对象属性的顺序在以下场景很重要：
- JSON 序列化
- 日志输出
- API 响应格式
- 用户界面显示

#### 6.2.2 两种顺序模式

| 模式 | 行为 | 适用场景 |
|------|------|----------|
| `"none"`（默认） | 内部系统决定顺序，不稳定 | 不关心顺序，追求性能 |
| `"original"` | 保持输入时的顺序 | API 契约、日志可读性、UI 显示 |

#### 6.2.3 同步解码示例

```typescript
const schema = Schema.Struct({
  a: Schema.Number,
  b: Schema.Literal("b"),
  c: Schema.Number
})

// 输入顺序：b, c, a
const input = { b: "b", c: 2, a: 1 }

// 默认：顺序不确定
decode(input)  // 可能输出 { a: 1, b: 'b', c: 2 }

// 保留原顺序
decode(input, { propertyOrder: "original" })
// 输出: { b: 'b', c: 2, a: 1 }  ← 保持输入顺序
```

#### 6.2.4 异步解码示例

异步场景更复杂，因为每个字段的解码时间不同：

```typescript
// 每个字段有不同的延迟
const schema = Schema.Struct({
  a: effectify("200 millis"),  // 200ms
  b: effectify("300 millis"),  // 300ms
  c: effectify("100 millis")   // 100ms
})

// 默认：先完成的先输出
// 输出: { c: 3, a: 1, b: 2 }  ← c 最快，所以排第一

// 保留原顺序：等待所有完成，按输入顺序输出
// 输出: { a: 1, b: 2, c: 3 }  ← 保持输入顺序
```

---

### 6.3 在模式级别自定义解析行为（`parseOptions`）

#### 6.3.1 核心概念

你可以在**不同层级**的模式上设置不同的解析选项：

```
顶层模式（all errors）
  └── 子模式（first error only）
        └── 更深层...
```

#### 6.3.2 实际例子

```typescript
const schema = Schema.Struct({
  a: Schema.Struct({
    b: Schema.String,
    c: Schema.String
  }).annotations({
    title: "first error only",
    parseOptions: { errors: "first" }  // 子模式：只显示第一个错误
  }),
  d: Schema.String
}).annotations({
  title: "all errors",
  parseOptions: { errors: "all" }      // 顶层：显示所有错误
})

// 输入缺少 b, c, d
decode({ a: {} })  // a 是空对象，b 和 c 都缺失，d 也缺失

// 输出：
all errors
├─ ["a"]
│  └─ first error only        ← 子模式的标题
│     └─ ["b"]                ← 只报告 b，没有报告 c
│        └─ is missing
└─ ["d"]                      ← 顶层的 d 缺失
   └─ is missing
```

**关键点**：子模式的设置覆盖了父级设置。虽然顶层要求显示所有错误，但子模式要求只显示第一个，所以 `a` 内部只报告了 `b` 的错误，没有报告 `c`。

---

### 6.4 类型守卫（`Schema.is`）

#### 6.4.1 是什么？

`Schema.is` 返回一个**类型守卫函数**：`(u: unknown) => u is Type`

#### 6.4.2 作用

1. **运行时检查**：判断值是否符合模式
2. **类型收窄**：TypeScript 自动推断类型

#### 6.4.3 示例

```typescript
const isPerson = Schema.is(Person)

// 运行时检查 + 类型收窄
function process(data: unknown) {
  if (isPerson(data)) {
    // TypeScript 知道这里 data 是 Person 类型
    console.log(data.name.toUpperCase())  // ✅ 安全
    console.log(data.age)                 // ✅ 安全
  } else {
    console.log("不是 Person")
  }
}
```

#### 6.4.4 注意

`Schema.is` 不考虑 `Encoded` 类型，只验证 `Type` 类型：

```typescript
const Person = Schema.Struct({
  age: Schema.NumberFromString  // Type=number, Encoded=string
})

const isPerson = Schema.is(Person)

isPerson({ age: 30 })   // ✅ true
isPerson({ age: "30" }) // ❌ false（因为 Type 是 number，不是 string）
```

---

### 6.5 断言（`Schema.asserts`）

#### 6.5.1 是什么？

`Schema.asserts` 返回一个**断言函数**：`(input: unknown) => asserts input is Type`

#### 6.5.2 与类型守卫的区别

| 特性 | 类型守卫 (`is`) | 断言 (`asserts`) |
|------|-----------------|------------------|
| 失败时 | 返回 `false` | 抛出错误 |
| 类型收窄 | 只在 `if` 块内 | 整个作用域（如果没抛异常） |
| 适用场景 | 条件判断 | 验证后继续执行 |

#### 6.5.3 示例

```typescript
const assertPerson = Schema.asserts(Person)

function process(data: unknown) {
  // 如果 data 不符合，这里会抛出错误
  assertPerson(data)
  
  // 执行到这里，TypeScript 知道 data 一定是 Person
  console.log(data.name.toUpperCase())  // ✅ 安全
  console.log(data.age)                 // ✅ 安全
}

// 使用
process({ name: "Alice", age: 30 })     // ✅ 正常执行
process({ name: "Alice", age: "30" })   // ❌ 抛出错误
```

---

### 6.6 管理缺失属性（`exact` 选项）

#### 默认行为

```typescript
const schema = Schema.Struct({ a: Schema.Unknown })
decode({})  // 输出: { a: undefined }
// 缺失的属性被视为 undefined
```

#### `exact: true` 的行为

```typescript
decode({}, { exact: true })  // 抛出错误：["a"] is missing
// 严格区分"缺失"和"undefined"
```

#### 不同 API 的默认行为

| API | 默认 `exact` | 说明 |
|-----|-------------|------|
| `decode*` | `false` | 缺失属性视为 `undefined` |
| `is` | `true` | 严格检查，缺失返回 `false` |
| `asserts` | `true` | 严格检查，缺失抛出错误 |

```typescript
// decode：默认宽松
Schema.decodeSync(schema)({})  // { a: undefined }

// is：默认严格
Schema.is(schema)({})  // false

// 可以手动覆盖
Schema.is(schema)({}, { exact: false })  // true
```

---

### 6.7 总结对比表

| 功能 | API/选项 | 默认值 | 说明 |
|------|----------|--------|------|
| 收集所有错误 | `errors: "all"` | `"first"` | 返回所有验证错误 |
| 属性顺序 | `propertyOrder: "original"` | `"none"` | 保持输入顺序 |
| 嵌套解析配置 | `parseOptions` 注解 | 继承父级 | 不同层级可不同设置 |
| 类型守卫 | `Schema.is` | - | 返回 `boolean`，类型收窄 |
| 断言 | `Schema.asserts` | - | 失败抛异常，类型收窄 |
| 缺失属性处理 | `exact: true` | 看 API | 严格区分"缺失"和 `undefined` |

---

### 5.7.1 核心要点

> **Effect Schema 提供了精细的控制选项，让你可以：一次性收集所有错误、控制输出顺序、在嵌套结构中独立配置解析行为，并通过类型守卫和断言实现运行时的类型安全验证。**

## 7. 命名约定 - 解释

这段文字解释了 Effect Schema 中**命名规则的设计哲学**：通过命名让你一眼就知道这个模式是做什么的，特别是它如何与 JSON 交互。

---

### 7.1 为什么命名很重要？

在 Effect Schema 中，命名不仅仅是方便阅读，它**传达了模式的行为**：

| 命名 | 你能立即知道 |
|------|-------------|
| `Schema.String` | 直接就是字符串，不需要转换 |
| `Schema.NumberFromString` | 从字符串转成数字，有转换 |
| `Schema.Date` | 把 Date 转成 JSON 字符串 |
| `Schema.DateFromSelf` | 就是 Date 本身，不做转换 |

---

### 7.2 两种命名策略

#### 7.2.1 JSON 兼容类型（直接命名）

**规则**：类型在 JSON 中有直接对应关系 → 直接用类型名

| Schema | 类型 | JSON 表示 |
|--------|------|-----------|
| `Schema.String` | `string` | `"hello"` |
| `Schema.Number` | `number` | `123` |
| `Schema.Boolean` | `boolean` | `true` |
| `Schema.Date` | `Date` | `"2024-01-01T00:00:00.000Z"` |

**特点**：
- 不需要额外说明"如何转换"
- 编码/解码是"透明的"（或 JSON 标准化的）

**为什么 `Date` 算 JSON 兼容？**

虽然 JSON 标准没有 `Date` 类型，但**业界约定**用 ISO 字符串表示日期。所以 `Schema.Date` 的意思是："这是一个 Date 对象，但在 JSON 中我会把它变成字符串"。

---

#### 7.2.2 非 JSON 兼容类型（带后缀命名）

**规则**：类型在 JSON 中没有直接对应 → 用 `FromXxx` 后缀说明**从哪里来**

| Schema | 含义 | 解码 | 编码 |
|--------|------|------|------|
| `NumberFromString` | 从字符串来的数字 | `"123"` → `123` | `123` → `"123"` |
| `DateFromSelf` | 就是 Date 本身 | `Date` 对象 → `Date` 对象 | `Date` 对象 → `Date` 对象 |
| `BigIntFromSelf` | 就是 BigInt 本身 | `1n` → `1n` | `1n` → `1n` |
| `SymbolFromSelf` | 就是 Symbol 本身 | `Symbol()` → `Symbol()` | `Symbol()` → `Symbol()` |

**命名模式解读**：

```
[Type]From[Source]
   ↑        ↑
 目标类型   来源类型
```

- `NumberFromString`：目标是 `number`，来源是 `string`
- `DateFromSelf`：目标是 `Date`，来源是 `Date`（自己）

---

### 7.3 为什么要区分这两种？

#### 核心原因：JSON 的限制

JSON 只支持这几种类型：
- `string`
- `number`
- `boolean`
- `null`
- `array`
- `object`

JSON **不支持**：
- `Date`（没有日期类型）
- `BigInt`（数字太大）
- `Symbol`（没有符号）
- `Map` / `Set`

#### 解决方案

1. **如果是常见类型 + 标准序列化方式** → 直接命名（如 `Schema.Date`）
2. **如果是特殊类型或需要明确转换** → 用 `FromXxx` 后缀

---

### 7.4 命名对比表

| 命名 | Type | Encoded | 说明 |
|------|------|---------|------|
| `Schema.String` | `string` | `string` | 直接对应 |
| `Schema.Number` | `number` | `number` | 直接对应 |
| `Schema.Boolean` | `boolean` | `boolean` | 直接对应 |
| `Schema.Date` | `Date` | `string` | Date → ISO 字符串 |
| `Schema.DateFromSelf` | `Date` | `Date` | 不做转换 |
| `Schema.NumberFromString` | `number` | `string` | 字符串转数字 |
| `Schema.BigIntFromSelf` | `bigint` | `bigint` | 不做转换 |
| `Schema.SymbolFromSelf` | `symbol` | `symbol` | 不做转换 |

---

### 7.5 实际例子

#### 例子1：`Schema.Date`

```typescript
const schema = Schema.Date

// 解码：字符串 → Date
const date = decode("2024-01-01T00:00:00.000Z")
console.log(date instanceof Date)  // true

// 编码：Date → 字符串
const json = encode(new Date("2024-01-01"))
console.log(json)  // "2024-01-01T00:00:00.000Z"
```

#### 例子2：`Schema.DateFromSelf`

```typescript
const schema = Schema.DateFromSelf

// 解码：Date → Date（不变）
const date = decode(new Date("2024-01-01"))
console.log(date instanceof Date)  // true

// 编码：Date → Date（不变）
const result = encode(new Date("2024-01-01"))
console.log(result instanceof Date)  // true
```

#### 例子3：`Schema.NumberFromString`

```typescript
const schema = Schema.NumberFromString

// 解码："123" → 123
const num = decode("123")
console.log(typeof num)  // "number"

// 编码：123 → "123"
const str = encode(123)
console.log(typeof str)  // "string"
```

---

### 7.6 为什么这样设计？

#### 1. 自文档化

看到 `NumberFromString`，你立刻知道：
- 解码时：字符串 → 数字
- 编码时：数字 → 字符串

不需要查文档。

#### 2. 避免歧义

如果不这样命名，你可能会困惑：
- `Schema.Date`：这是 Date 对象还是字符串？ → 命名告诉你：是 Date 对象，但 JSON 中是字符串
- `Schema.Number`：这是数字 → 命名告诉你：就是数字

#### 3. 符合直觉

```
// 一眼看懂
Schema.NumberFromString      // 从字符串来的数字
Schema.DateFromSelf          // 就是 Date 本身
Schema.NonEmptyString        // 非空字符串
Schema.Trimmed               // 已修剪的字符串
```

---

### 7.7 核心原则总结

| 原则 | 说明 |
|------|------|
| **JSON 优先** | 优先考虑 JSON 序列化场景 |
| **命名即文档** | 从命名就能看出行为 |
| **明确转换** | `FromXxx` 后缀表示有转换 |
| **FromSelf 后缀** | 表示不做转换，就是它自己 |

---

### 7.8 一句话总结

> **Effect Schema 的命名约定让你一看就知道：这个模式在 JSON 中长什么样，以及解码/编码时发生了什么转换。`FromXxx` = 有转换，`FromSelf` = 没有转换，直接命名 = JSON 兼容或业界标准。**