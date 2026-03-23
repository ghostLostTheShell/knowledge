## 1. 基础用法 - 解释

这段文字是 Effect Schema 的**入门教程**，教你如何使用各种基础模式来定义数据的形状。我把这些概念分成几个层次来解释。

---

## 1.1 原始类型（Primitives）

### 1.1.1 是什么？

原始类型是**最基础**的模式，对应 TypeScript 的基本类型。

### 1.1.2 为什么需要它们？

你需要用它们来构建更复杂的模式。就像盖房子需要砖块一样。

### 1.1.3 原始类型对照表

| Schema | TypeScript | 说明 |
|--------|------------|------|
| `Schema.String` | `string` | 字符串 |
| `Schema.Number` | `number` | 数字 |
| `Schema.Boolean` | `boolean` | 布尔值 |
| `Schema.BigIntFromSelf` | `bigint` | 大整数（注意：是 `FromSelf`，因为 JSON 不支持 bigint）|
| `Schema.SymbolFromSelf` | `symbol` | 符号 |
| `Schema.Object` | `object` | 对象类型（非原始值）|
| `Schema.Undefined` | `undefined` | 未定义 |
| `Schema.Void` | `void` | 无返回值 |
| `Schema.Any` | `any` | 任意类型（放弃类型检查）|
| `Schema.Unknown` | `unknown` | 未知类型（需要先验证）|
| `Schema.Never` | `never` | 永不出现的类型 |

### 1.1.4 使用示例

```typescript
const schema = Schema.String

// 正确使用
Schema.decodeUnknownSync(schema)("hello")  // ✅ "hello"

// 错误使用
Schema.decodeUnknownSync(schema)(null)     // ❌ 抛出 ParseError
```

---

## 1.2 `asSchema` - 展开模式

### 1.2.1 为什么需要它？

内置模式（如 `Schema.String`）被包装成**不透明类型**，有时你需要看到它的"真实面目"。

```typescript
// 不透明形式（内部实现）
const schema = Schema.String           // typeof Schema.String

// 展开后的形式（更清晰的类型）
const normalized = Schema.asSchema(schema)  // Schema<string, string, never>
```

### 1.2.2 什么时候用？

- 需要访问底层 AST 时
- 进行高级模式操作时
- 调试时想看清类型

---

## 1.3 唯一符号（Unique Symbols）

### 1.3.1 是什么？

为 TypeScript 的 `unique symbol` 类型创建模式。

```typescript
const mySymbol = Symbol.for("mySymbol")
const schema = Schema.UniqueSymbolFromSelf(mySymbol)

// 只能匹配这个特定的符号
Schema.decodeUnknownSync(schema)(mySymbol)  // ✅ 成功
Schema.decodeUnknownSync(schema)(Symbol.for("other"))  // ❌ 失败
```

### 1.3.2 使用场景

- 定义需要精确符号匹配的 API
- 创建品牌类型（branded types）

---

## 1.4 字面量（Literals）

### 1.4.1 是什么？

字面量模式要求值**必须是某个确切的值**，而不是某种类型。

### 1.4.2 对比

```typescript
// 类型：只要是字符串就行
Schema.String  // 接受 "a", "b", "hello", 任何字符串

// 字面量：必须是 "a"
Schema.Literal("a")  // 只接受 "a"
```

### 1.4.3 字面量联合

多个字面量组合成一个"或"的关系：

```typescript
const schema = Schema.Literal("a", "b", "c")
// 接受 "a" 或 "b" 或 "c"
```

### 1.4.4 实际应用

```typescript
// 定义状态枚举
const Status = Schema.Literal("pending", "active", "completed")

type Status = typeof Status.Type  // "pending" | "active" | "completed"
```

### 1.4.5 `pickLiteral` - 选取子集

从已有的字面量联合中挑选一部分：

```typescript
const FruitCategory = Schema.Literal("sweet", "citrus", "tropical")

// 只选 sweet 和 citrus
const SweetAndCitrus = FruitCategory.pipe(
  Schema.pickLiteral("sweet", "citrus")
)
```

### 1.4.6 重用字面量模式的好处

```typescript
// 定义一次
const FruitCategory = Schema.Literal("sweet", "citrus", "tropical")

// 多处使用
const Fruit = Schema.Struct({
  id: Schema.Number,
  category: FruitCategory           // 接受所有三种
})

const SweetFruit = Schema.Struct({
  id: Schema.Number,
  category: FruitCategory.pipe(     // 只接受 sweet
    Schema.pickLiteral("sweet")
  )
})
```

---

## 1.5 模板字面量（Template Literals）

### 1.5.1 是什么？

对应 TypeScript 的[模板字面量类型](https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html)，用于定义有特定模式的字符串。

### 1.5.2 简单例子

```typescript
// 匹配 "a" + 任意字符串
const schema = Schema.TemplateLiteral("a", Schema.String)
// 接受: "a", "ab", "a123", "ahello"
```

### 1.5.3 复杂例子

```typescript
// 匹配 "https://" + 任意字符串 + ".com" 或 ".net"
const url = Schema.TemplateLiteral(
  "https://",
  Schema.String,
  ".",
  Schema.Literal("com", "net")
)
// 接受: "https://example.com", "https://test.net"
// 不接受: "http://example.com" (协议不对)
```

### 1.5.4 `TemplateLiteralParser` - 解析模板

普通的 `TemplateLiteral` 只验证格式，输出还是字符串。

`TemplateLiteralParser` 会**解析成元组**：

```typescript
// 普通版本：只验证
const validate = Schema.TemplateLiteral(
  Schema.NumberFromString,  // 注意：这里写了 NumberFromString
  "a",
  Schema.String
)
// 解码 "100afoo" → "100afoo"（还是字符串）

// 解析版本：自动解析
const parse = Schema.TemplateLiteralParser(
  Schema.NumberFromString,  // 这里也会解析
  "a",
  Schema.String
)
// 解码 "100afoo" → [100, "a", "foo"]  ← 自动解析成元组！
```

**对比**：

| 功能 | `TemplateLiteral` | `TemplateLiteralParser` |
|------|-------------------|------------------------|
| 验证格式 | ✅ | ✅ |
| 解析成结构化数据 | ❌ | ✅ |
| 输出类型 | `string` | 元组 |

---

## 1.6 原生枚举（Native Enums）

### 1.6.1 是什么？

为 TypeScript 的 `enum` 创建模式。

```typescript
enum Fruits {
  Apple,
  Banana
}

const schema = Schema.Enums(Fruits)
// 接受 0 或 1
```

### 1.6.2 注意

枚举在 JSON 中通常用**数字**表示，不是字符串。

```typescript
// 枚举值
Fruits.Apple   // 0
Fruits.Banana  // 1

// 所以模式接受的是数字
decode(0)  // ✅
decode(1)  // ✅
decode("Apple")  // ❌
```

### 1.6.3 访问枚举成员

```typescript
schema.enums.Apple    // 0
schema.enums.Banana   // 1
schema.enums          // 整个枚举对象
```

---

## 1.7 核心概念总结

| 概念 | 作用 | 示例 |
|------|------|------|
| **原始类型** | 基础数据类型 | `Schema.String` |
| **asSchema** | 展开不透明类型 | `Schema.asSchema(Schema.String)` |
| **唯一符号** | 精确匹配 symbol | `Schema.UniqueSymbolFromSelf(sym)` |
| **字面量** | 确切的值 | `Schema.Literal("a")` |
| **字面量联合** | 多个可能的值 | `Schema.Literal("a", "b")` |
| **pickLiteral** | 选取子集 | `FruitCategory.pipe(pickLiteral("sweet"))` |
| **模板字面量** | 模式化字符串 | `TemplateLiteral("a", Schema.String)` |
| **模板解析器** | 解析成元组 | `TemplateLiteralParser(...)` |
| **原生枚举** | TypeScript enum | `Schema.Enums(Fruits)` |

---

## 1.8 选择指南

| 你想表达什么 | 用什么 |
|-------------|--------|
| 任何字符串 | `Schema.String` |
| 特定的字符串 | `Schema.Literal("exact")` |
| 几个字符串之一 | `Schema.Literal("a", "b", "c")` |
| 有模式的字符串 | `Schema.TemplateLiteral(...)` |
| 有模式且需解析 | `Schema.TemplateLiteralParser(...)` |
| TypeScript 枚举 | `Schema.Enums(MyEnum)` |
| 唯一符号 | `Schema.UniqueSymbolFromSelf(sym)` |

---

### 1.8.1 一句话总结

> **基础模式是 Effect Schema 的积木：原始类型是基础块，字面量和模板是精确控制，枚举是 TypeScript 互操作，通过这些你可以构建任意复杂的数据结构。**


## 2. 联合类型（Unions）- 解释

这段文字详细介绍了 Effect Schema 中**联合类型**的各个方面：基本用法、求值顺序、字面量联合、可空类型，以及**可辨识联合（Discriminated Unions）**——这是处理复杂数据结构的重要模式。

---

## 2.1 什么是联合类型？

联合类型表示一个值可以是**多种类型中的一种**，对应 TypeScript 的 `|` 操作符。

```typescript
// TypeScript
type MyType = string | number

// Effect Schema
const schema = Schema.Union(Schema.String, Schema.Number)
// 等价于：string | number
```

---

## 2.2 联合成员求值顺序（非常重要！）

### 2.2.1 核心规则

联合成员按**定义的顺序**依次尝试匹配。一旦匹配成功，就停止尝试。

### 2.2.2 问题场景：重叠模式

```typescript
const Member1 = Schema.Struct({ a: Schema.String })        // 只有 a
const Member2 = Schema.Struct({ a: Schema.String, b: Schema.Number })  // a 和 b

// ❌ 错误顺序：Member1 在前
const Bad = Schema.Union(Member1, Member2)

// 输入有 a 和 b
decode(Bad)({ a: "a", b: 12 })
// 结果：{ a: 'a' }  ← b 丢失了！
// 原因：Member1 先匹配成功，所以解码停止了
```

```typescript
// ✅ 正确顺序：更具体的在前
const Good = Schema.Union(Member2, Member1)

decode(Good)({ a: "a", b: 12 })
// 结果：{ a: 'a', b: 12 }  ← 完整保留
```

### 2.2.3 原则总结

| 规则 | 说明 |
|------|------|
| **更具体的在前** | 字段多的、约束严格的放在前面 |
| **更通用的在后** | 字段少的、约束宽松的放在后面 |

类比：如果有人说"给我一个苹果或水果"，你应该先检查是不是苹果，而不是先说是水果就结束。

---

## 2.3 字面量联合

### 2.3.1 两种写法

```typescript
// 方式1：用 Union 组合
const way1 = Schema.Union(
  Schema.Literal("a"),
  Schema.Literal("b"),
  Schema.Literal("c")
)

// 方式2：直接传多个字面量（更简洁）
const way2 = Schema.Literal("a", "b", "c")
```

两种方式结果一样：`"a" | "b" | "c"`

### 2.3.2 自定义错误消息

```typescript
// 默认：每个字面量都有单独的错误消息
const defaultMsg = Schema.Literal("a", "b", "c")
// 错误: "Expected 'a' | 'b' | 'c'"

// 统一消息：覆盖所有
const unified = Schema.Literal("a", "b", "c").annotations({
  message: () => ({ message: "Not a valid code", override: true })
})
// 错误: "Not a valid code"
```

---

## 2.4 可空类型（Nullable Types）

### 2.4.1 三种快捷方式

| 函数 | 含义 | TypeScript 等价 |
|------|------|-----------------|
| `Schema.NullOr(T)` | T 或 null | `T \| null` |
| `Schema.UndefinedOr(T)` | T 或 undefined | `T \| undefined` |
| `Schema.NullishOr(T)` | T 或 null 或 undefined | `T \| null \| undefined` |

```typescript
// 字符串或 null
const nullable = Schema.NullOr(Schema.String)
// 接受: "hello", null
// 不接受: undefined

// 字符串或 undefined
const optional = Schema.UndefinedOr(Schema.String)
// 接受: "hello", undefined
// 不接受: null

// 字符串或 null 或 undefined
const nullish = Schema.NullishOr(Schema.String)
// 接受: "hello", null, undefined
```

---

## 2.5 可辨识联合（Discriminated Unions）

### 2.5.1 什么是可辨识联合？

TypeScript 中一种模式：通过一个**公共字段**（可辨识属性）来区分联合中的不同成员。

```typescript
// TypeScript 中的可辨识联合
type Shape = 
  | { kind: "circle"; radius: number }    // kind 是 "circle"
  | { kind: "square"; sideLength: number } // kind 是 "square"

// 使用时，TypeScript 自动收窄类型
function area(shape: Shape) {
  if (shape.kind === "circle") {
    return Math.PI * shape.radius ** 2  // ✅ shape 被推断为 circle
  } else {
    return shape.sideLength ** 2        // ✅ shape 被推断为 square
  }
}
```

### 2.5.2 在 Effect Schema 中定义

```typescript
const Circle = Schema.Struct({
  kind: Schema.Literal("circle"),
  radius: Schema.Number
})

const Square = Schema.Struct({
  kind: Schema.Literal("square"),
  sideLength: Schema.Number
})

const Shape = Schema.Union(Circle, Square)
```

### 2.5.3 关键：可辨识属性必须出现在解码后的数据中

这意味着当你从外部接收数据时，数据必须包含 `kind` 字段：

```typescript
// ✅ 正确的输入
decode(Shape)({ kind: "circle", radius: 10 })
decode(Shape)({ kind: "square", sideLength: 5 })

// ❌ 缺少 kind 会失败
decode(Shape)({ radius: 10 })  // 错误：缺少 kind
```

---

## 2.6 转换简单联合为可辨识联合

### 2.6.1 问题场景

你有一个没有可辨识属性的联合：

```typescript
const Circle = Schema.Struct({ radius: Schema.Number })      // 无 kind
const Square = Schema.Struct({ sideLength: Schema.Number })  // 无 kind
const Shape = Schema.Union(Circle, Square)
```

但外部数据**没有** `kind` 字段，只有 `radius` 或 `sideLength`。

### 2.6.2 解决方案1：手动转换（使用 `transform`）

```typescript
const DiscriminatedShape = Schema.Union(
  Schema.transform(
    Circle,
    Schema.Struct({ ...Circle.fields, kind: Schema.Literal("circle") }),
    {
      decode: (circle) => ({ ...circle, kind: "circle" }),
      encode: ({ kind: _, ...rest }) => rest
    }
  ),
  Schema.transform(
    Square,
    Schema.Struct({ ...Square.fields, kind: Schema.Literal("square") }),
    {
      decode: (square) => ({ ...square, kind: "square" }),
      encode: ({ kind: _, ...rest }) => rest
    }
  )
)
```

**流程**：
- 解码时：`{ radius: 10 }` → `{ radius: 10, kind: "circle" }`
- 编码时：`{ radius: 10, kind: "circle" }` → `{ radius: 10 }`

### 2.6.3 解决方案2：使用 `attachPropertySignature`（更简洁）

```typescript
const DiscriminatedShape = Schema.Union(
  Circle.pipe(Schema.attachPropertySignature("kind", "circle")),
  Square.pipe(Schema.attachPropertySignature("kind", "square"))
)
```

效果完全相同，但代码少得多！

### 2.6.4 `attachPropertySignature` 的限制

<aside type="caution">
  只能**添加**新属性，不能替换或覆盖现有属性。
</aside>

```typescript
// ✅ 可以：添加新属性
Circle.pipe(Schema.attachPropertySignature("kind", "circle"))

// ❌ 不行：覆盖已有属性
// 如果 Circle 已经有 kind 字段，会报错
```

---

## 2.7 完整对比表

| 概念 | 用途 | 示例 |
|------|------|------|
| **普通联合** | 值可以是多种类型之一 | `string \| number` |
| **字面量联合** | 值可以是多个具体值之一 | `"a" \| "b" \| "c"` |
| **可空类型** | 值可以是 T 或 null/undefined | `string \| null` |
| **可辨识联合** | 通过公共字段区分成员 | `{ kind: "circle", radius }` |
| **attachPropertySignature** | 为现有模式添加可辨识字段 | `Circle.pipe(attachPropertySignature("kind", "circle"))` |

---

## 2.8 最佳实践

### 2.8.1 联合成员的顺序

```typescript
// ✅ 正确：具体的在前，通用的在后
Schema.Union(
  Schema.Struct({ a: Schema.String, b: Schema.Number }),  // 具体
  Schema.Struct({ a: Schema.String })                     // 通用
)

// ❌ 错误：通用的在前会"吃掉"具体的数据
Schema.Union(
  Schema.Struct({ a: Schema.String }),                    // 通用
  Schema.Struct({ a: Schema.String, b: Schema.Number })   // 具体
)
```

### 2.8.2 可辨识属性命名

```typescript
// 常用命名：_tag, kind, type, variant
const Circle = Schema.Struct({
  _tag: Schema.Literal("circle"),
  radius: Schema.Number
})
```

### 2.8.3 优先使用 `attachPropertySignature`

当你需要为已有模式添加可辨识字段时，优先使用这个简洁的 API，而不是手写 `transform`。

---

## 2.9 核心要点总结

> **联合类型让你表达"或"的关系。顺序很重要——更具体的成员应该在前。可辨识联合通过公共字段让 TypeScript 自动推断类型，是处理多种相关数据结构的标准模式。`attachPropertySignature` 是添加可辨识字段的快捷方式。**

## 3. 元组、数组、记录和结构体 - 解释

这段文字介绍了 Effect Schema 中**复合数据类型**的四种核心结构：**元组、数组、记录和结构体**。它们对应 TypeScript 中不同类型的数据集合。

---

## 3.1 元组（Tuples）

### 3.1.1 什么是元组？

元组是**固定长度、元素类型可不同**的有序集合。

```typescript
// TypeScript 元组
type Point = [number, number]  // 两个数字
type Person = [string, number] // 字符串和数字

// Effect Schema 元组
const point = Schema.Tuple(Schema.Number, Schema.Number)  // [number, number]
```

### 3.1.2 元组 vs 数组

| 特性 | 元组 | 数组 |
|------|------|------|
| 长度 | 固定 | 可变 |
| 元素类型 | 可以不同 | 通常相同 |
| 索引含义 | 每个位置有特定含义 | 所有位置类型相同 |

### 3.1.3 必需元素

```typescript
const schema = Schema.Tuple(Schema.String, Schema.Number)
// 类型: readonly [string, number]

// 正确使用
decode(schema)(["hello", 123])  // ✅

// 错误使用
decode(schema)(["hello"])       // ❌ 缺少第二个元素
decode(schema)(["hello", "123"]) // ❌ 第二个元素应该是数字
```

### 3.1.4 追加元素

```typescript
const tuple1 = Schema.Tuple(Schema.String, Schema.Number)
const tuple2 = Schema.Tuple(...tuple1.elements, Schema.Boolean)
// 类型: readonly [string, number, boolean]
```

### 3.1.5 可选元素

```typescript
const schema = Schema.Tuple(
  Schema.String,                       // 必需
  Schema.optionalElement(Schema.Number) // 可选
)
// 类型: readonly [string, number?]
// 接受: ["hello"], ["hello", 123]
```

### 3.1.6 剩余元素（Rest Elements）

剩余元素允许元组接受**任意数量的额外元素**，类型相同。

```typescript
const schema = Schema.Tuple(
  [Schema.String, Schema.optionalElement(Schema.Number)], // 前面的元素
  Schema.Boolean,  // 剩余元素：任意数量的布尔值
  Schema.String    // 剩余元素之后的额外元素
)
// 类型: readonly [string, number?, ...boolean[], string]
```

**理解这个类型**：
- 第一个元素必须是 `string`
- 第二个元素可以是 `number` 或不存在
- 之后可以有任意数量的 `boolean`
- 最后一个元素必须是 `string`

**示例**：
```typescript
// 有效输入
["a", 1, true, true, "b"]     // 有可选数字，两个布尔，最后字符串
["a", true, true, true, "b"]  // 无可选数字，三个布尔，最后字符串
["a", "b"]                    // 无可选数字，无布尔，最后字符串
```

### 3.1.7 元组注解

```typescript
const Point = Schema.Tuple(
  Schema.element(Schema.Number).annotations({
    title: "X",
    description: "X coordinate"
  }),
  Schema.optionalElement(Schema.Number).annotations({
    title: "Y",
    description: "optional Y coordinate"
  })
)
```

注解会影响生成的 JSON Schema：
```json
{
  "items": [
    { "type": "number", "title": "X" },
    { "type": "number", "title": "Y" }
  ]
}
```

### 3.1.8 访问元组成员

```typescript
const schema = Schema.Tuple(
  [Schema.String, Schema.optionalElement(Schema.Number)],
  Schema.Boolean
)

schema.elements  // 前面的元素 [String, optional(Number)]
schema.rest       // 剩余元素 [Boolean]
```

---

## 3.2 数组（Arrays）

### 3.2.1 基本数组

```typescript
const schema = Schema.Array(Schema.Number)
// 类型: readonly number[]
```

**特点**：
- 元素类型相同
- 长度可变
- 默认只读

### 3.2.2 可变数组

```typescript
const mutable = Schema.mutable(Schema.Array(Schema.Number))
// 类型: number[]  (可修改)
```

**注意**：`mutable` 是浅层的，不影响嵌套对象。

### 3.2.3 非空数组

```typescript
const nonEmpty = Schema.NonEmptyArray(Schema.Number)
// 类型: readonly [number, ...number[]]
// 至少有一个元素
```

### 3.2.4 访问数组值类型

```typescript
const schema = Schema.Array(Schema.Number)
schema.value  // typeof Schema.Number
```

---

## 3.3 记录（Records）

### 3.3.1 什么是记录？

记录是**键值对**的集合，对应 TypeScript 的索引签名类型。

```typescript
// TypeScript 索引签名
type Dict = { [key: string]: number }

// Effect Schema 记录
const dict = Schema.Record({ key: Schema.String, value: Schema.Number })
```

### 3.3.2 字符串键

```typescript
const schema = Schema.Record({
  key: Schema.String,
  value: Schema.Number
})
// 类型: { readonly [x: string]: number }
```

### 3.3.3 符号键

```typescript
const schema = Schema.Record({
  key: Schema.SymbolFromSelf,
  value: Schema.Number
})
// 类型: { readonly [x: symbol]: number }
```

### 3.3.4 字面量键（固定键集）

```typescript
const schema = Schema.Record({
  key: Schema.Union(Schema.Literal("a"), Schema.Literal("b")),
  value: Schema.Number
})
// 类型: { readonly a: number; readonly b: number }
// 注意：这不是索引签名，而是固定属性
```

### 3.3.5 模板字面量键

```typescript
const schema = Schema.Record({
  key: Schema.TemplateLiteral(Schema.Literal("a"), Schema.String),
  value: Schema.Number
})
// 类型: { readonly [x: `a${string}`]: number }
// 键必须以 "a" 开头
```

### 3.3.6 精炼键（过滤）

```typescript
const schema = Schema.Record({
  key: Schema.String.pipe(Schema.minLength(2)),
  value: Schema.Number
})

// 解码时，长度 < 2 的键会被过滤掉
decode(schema)({ a: 1, bb: 2 })  // { bb: 2 }  ← "a" 被移除
```

**关键**：精炼键是**过滤器**，不是验证器。默认会静默移除不符合条件的键。

如果想让它报错：
```typescript
decode(schema, { onExcessProperty: "error" })({ a: 1, bb: 2 })
// 抛出错误: ["a"] is unexpected
```

### 3.3.7 键转换的限制

```typescript
// ❌ 不支持键转换
const bad = Schema.Record({
  key: Schema.Trim,  // 错误！
  value: Schema.Number
})
```

**原因**：多个键可能转换后变成同一个键（如 `" a"` 和 `"a "` 都变成 `"a"`），产生冲突。

**解决方案**：在外部转换

```typescript
const schema = Schema.transform(
  Schema.Record({ key: Schema.String, value: Schema.NumberFromString }),
  Schema.Record({ key: Schema.Trimmed, value: Schema.Number }),
  {
    decode: (record) => Record.mapKeys(record, (key) => key.trim()),
    encode: identity
  }
)
```

---

## 3.4 结构体（Structs）

### 3.4.1 基本结构体

```typescript
const Person = Schema.Struct({
  name: Schema.String,
  age: Schema.Number
})
// 类型: { readonly name: string; readonly age: number }
```

**特点**：
- 固定字段
- 每个字段有独立类型
- 默认只读

### 3.4.2 空结构体的陷阱

```typescript
const empty = Schema.Struct({})
// 类型: {}  ← 相当于 unknown！

decode(empty)(null)   // ✅ 通过
decode(empty)(123)    // ✅ 通过
decode(empty)("hello") // ✅ 通过
```

空结构体不验证任何内容，几乎所有值都能通过。通常不是你想要的。

---

## 3.5 四种结构对比

| 结构 | 长度 | 键类型 | 值类型 | 示例 |
|------|------|--------|--------|------|
| **元组** | 固定 | 数字索引 | 可不同 | `[string, number]` |
| **数组** | 可变 | 数字索引 | 相同 | `number[]` |
| **记录** | 可变 | 字符串/符号 | 相同 | `{ [key: string]: number }` |
| **结构体** | 固定 | 字符串字面量 | 可不同 | `{ name: string, age: number }` |

---

## 3.6 选择指南

| 你想表达什么 | 用什么 |
|-------------|--------|
| 固定顺序、不同类型 | `Tuple` |
| 可变长度、相同类型 | `Array` |
| 至少有一个元素 | `NonEmptyArray` |
| 键是任意字符串 | `Record` |
| 键是固定的几个 | `Struct` |
| 需要可修改 | `mutable()` |

---

## 3.7 核心要点总结

> **元组是固定长度的位置列表，数组是可变长度的同类列表，记录是任意键的值字典，结构体是固定键的对象。选择哪种取决于你需要的是固定还是可变结构，以及键是固定的还是动态的。**

## 索引签名、标记结构体、选择/省略、partial/required/keyof - 解释

这段文字涵盖了 Effect Schema 中**高级结构体操作**的多个方面：索引签名、标记结构体（Tagged Structs）、自定义类支持、属性选择/省略、可选/必需转换，以及键提取。

---

## 4.1 索引签名（Index Signatures）

### 4.1.1 什么是索引签名？

允许一个对象同时拥有**固定属性**和**动态属性**。

```typescript
// TypeScript 中的索引签名
type Config = {
  version: number           // 固定属性
  [key: string]: string     // 动态属性：其他所有键的值都是字符串
}
```

### 4.1.2 在 Effect Schema 中定义

```typescript
const schema = Schema.Struct(
  { a: Schema.Number },                    // 固定属性
  { key: Schema.String, value: Schema.Number }  // 索引签名
)
// 类型: { readonly a: number; readonly [x: string]: number }
```

### 4.1.3 两种写法等价

```typescript
// 写法1：直接传对象
Schema.Struct({ a: Schema.Number }, { key: Schema.String, value: Schema.Number })

// 写法2：使用 Schema.Record
Schema.Struct({ a: Schema.Number }, Schema.Record({ key: Schema.String, value: Schema.Number }))
```

### 4.1.4 多个索引签名

每种键类型只能有一个索引签名：

```typescript
// ✅ 有效：string 和 symbol 各一个
Schema.Struct(
  { a: Schema.Number },
  { key: Schema.String, value: Schema.Number },   // string 索引
  { key: Schema.SymbolFromSelf, value: Schema.Number }  // symbol 索引
)

// ❌ 无效：两个 string 索引
Schema.Struct(
  { a: Schema.Number },
  { key: Schema.String, value: Schema.Number },
  { key: Schema.String, value: Schema.Boolean }  // 重复！
)
```

### 4.1.5 冲突的索引签名

当固定属性的类型与索引签名的类型不一致时，会发生冲突：

```typescript
// ❌ 冲突：a 是 string，但索引签名要求所有值都是 number
const bad = Schema.Struct(
  { a: Schema.String },    // 固定属性是 string
  { key: Schema.String, value: Schema.Number }  // 索引签名要求 number
)
// 生成的类型：{ a: string; [x: string]: number } 
// TypeScript 会报错，因为 a 同时是 string 和 number
```

#### 4.1.5.1 解决方法：分离处理

```typescript
// 1. 固定属性单独处理
const Fixed = Schema.Struct({ a: Schema.String })

// 2. 动态属性单独处理（排除固定属性的键）
const Dynamic = Schema.Record({
  key: Schema.String.pipe(
    Schema.filter(key => !Object.keys(Fixed.fields).includes(key))
  ),
  value: Schema.Number
})

// 3. 组合
const Result = Schema.compose(
  // 复制输入为两份
  Schema.transform(
    Schema.Object,
    Schema.Tuple(Schema.Object, Schema.Object),
    { decode: (a) => [a, a], encode: ([a, b]) => ({ ...a, ...b }) }
  ),
  // 分别验证
  Schema.Tuple(Fixed, Dynamic)
)
```

---

## 4.2 标记结构体（Tagged Structs）

### 4.2.1 什么是标记？

标记是一个**字面量值**，用于区分联合中的不同成员。它是可辨识联合的核心。

### 4.2.2 方式1：使用 `Schema.tag`

```typescript
const User = Schema.Struct({
  _tag: Schema.tag("User"),  // 固定值 "User"
  name: Schema.String,
  age: Schema.Number
})

User.make({ name: "John", age: 44 })
// 输出: { _tag: 'User', name: 'John', age: 44 }
```

### 4.2.3 方式2：使用 `Schema.TaggedStruct`（更简洁）

```typescript
const User = Schema.TaggedStruct("User", {
  name: Schema.String,
  age: Schema.Number
})

User.make({ name: "John", age: 44 })
// 输出: { _tag: 'User', name: 'John', age: 44 }
```

### 4.2.4 关键区别

| 操作 | `TaggedStruct` 默认行为 |
|------|------------------------|
| 构造（`make`） | `_tag` 自动添加，无需提供 |
| 解码（`decode`） | `_tag` 必须存在 |

```typescript
// make：不需要提供 _tag
User.make({ name: "John", age: 44 })  // ✅

// decode：必须提供 _tag
decode(User)({ name: "John", age: 44 })  // ❌ 缺少 _tag
decode(User)({ _tag: "User", name: "John", age: 44 })  // ✅
```

### 4.2.5 让 decode 也自动添加 _tag

```typescript
const TaggedStruct = (tag, fields) =>
  Schema.Struct({
    _tag: Schema.Literal(tag).pipe(
      Schema.optional,
      Schema.withDefaults({
        constructor: () => tag,   // make 时自动添加
        decoding: () => tag       // decode 时自动添加
      })
    ),
    ...fields
  })

const User = TaggedStruct("User", { name: Schema.String, age: Schema.Number })

// 现在 decode 也不需要 _tag 了
decode(User)({ name: "John", age: 44 })  // ✅
```

### 4.2.6 多个标记

```typescript
const Product = Schema.TaggedStruct("Product", {
  category: Schema.tag("Electronics"),  // 第二个标记
  name: Schema.String,
  price: Schema.Number
})

Product.make({ name: "Smartphone", price: 999 })
// 输出: { _tag: 'Product', category: 'Electronics', name: 'Smartphone', price: 999 }
```

---

## 4.3 `instanceOf` - 自定义类模式

### 4.3.1 基本用法

```typescript
class MyData {
  constructor(readonly name: string) {}
}

const MyDataSchema = Schema.instanceOf(MyData)

decode(MyDataSchema)(new MyData("name"))  // ✅
decode(MyDataSchema)({ name: "name" })    // ❌ 不是实例
```

### 4.3.2 私有构造函数的处理

```typescript
class MyData {
  static make = (name: string) => new MyData(name)
  private constructor(readonly name: string) {}
}

// ❌ instanceOf 不行（构造函数私有）
const bad = Schema.instanceOf(MyData)

// ✅ 使用 declare
const MyDataSchema = Schema.declare(
  (input): input is MyData => input instanceof MyData
).annotations({ identifier: "MyData" })
```

### 4.3.3 验证实例字段

```typescript
const MyDataFields = Schema.Struct({
  name: Schema.NonEmptyString
})

const MyDataSchema = Schema.instanceOf(MyData).pipe(
  Schema.filter((a, options) =>
    ParseResult.validateEither(MyDataFields)(a, options).pipe(
      Either.flip,
      Either.getOrUndefined
    )
  )
)

decode(MyDataSchema)(new MyData(""))  // ❌ 空字符串错误
```

---

## 4.4 属性选择与省略

### 4.4.1 `pick` - 选择属性

```typescript
const MyStruct = Schema.Struct({
  a: Schema.String,
  b: Schema.Number,
  c: Schema.Boolean
})

// 只保留 a 和 c
const Picked = MyStruct.pick("a", "c")
// 类型: { readonly a: string; readonly c: boolean }
```

### 4.4.2 `omit` - 排除属性

```typescript
// 排除 b
const Omitted = MyStruct.omit("b")
// 类型: { readonly a: string; readonly c: boolean }
```

### 4.4.3 对联合使用

```typescript
const MyUnion = Schema.Union(
  Schema.Struct({ a: Schema.String, b: Schema.String }),
  Schema.Struct({ a: Schema.Number, b: Schema.Number })
)

// 只保留 a
const Picked = MyUnion.pipe(Schema.pick("a"))
// 类型: { readonly a: string | number }
```

---

## 4.5 `partial` 和 `required`

### 4.5.1 `partial` - 所有属性变可选

```typescript
const schema = Schema.partial(Schema.Struct({ a: Schema.String }))
// 类型: { readonly a?: string | undefined }
```

### 4.5.2 精确可选（不含 undefined）

```typescript
const schema = Schema.partialWith(
  Schema.Struct({ a: Schema.String }),
  { exact: true }
)
// 类型: { readonly a?: string }  ← 没有 undefined
```

### 4.5.3 `required` - 所有属性变必需

```typescript
const schema = Schema.required(
  Schema.Struct({
    a: Schema.optionalWith(Schema.String, { exact: true }),
    b: Schema.optionalWith(Schema.Number, { exact: true })
  })
)
// 类型: { readonly a: string; readonly b: number }
```

---

## 4.6 `keyof` - 提取键

```typescript
const schema = Schema.Struct({
  a: Schema.String,
  b: Schema.Number
})

const keys = Schema.keyof(schema)
// 类型: "a" | "b"
```

---

## 4.7 完整操作对比

| 操作 | 作用 | 示例 |
|------|------|------|
| **索引签名** | 固定属性 + 动态属性 | `Struct({ a: Number }, { key: String, value: Number })` |
| **tag** | 添加可辨识字段 | `Schema.tag("User")` |
| **TaggedStruct** | 快速定义标记结构体 | `TaggedStruct("User", { name: String })` |
| **instanceOf** | 自定义类模式 | `instanceOf(MyClass)` |
| **pick** | 选择部分属性 | `struct.pick("a", "c")` |
| **omit** | 排除部分属性 | `struct.omit("b")` |
| **partial** | 所有属性变可选 | `partial(struct)` |
| **partialWith** | 精确可选（无 undefined） | `partialWith(struct, { exact: true })` |
| **required** | 所有属性变必需 | `required(struct)` |
| **keyof** | 提取键的类型 | `keyof(struct)` |

---

## 4.8 核心要点总结

> **索引签名让对象同时拥有固定和动态属性；标记结构体是定义可辨识联合的便捷方式；`pick`/`omit` 用于属性筛选；`partial`/`required` 控制可选性；`keyof` 提取键类型。这些工具让你能灵活地组合和转换已有模式。**