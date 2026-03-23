## 1. 过滤器（Filters）- 解释

这段文字详细介绍了 Effect Schema 中**过滤器**的用法。过滤器让你在基础类型检查之上添加**自定义验证逻辑**，这是确保数据质量的关键工具。

---

## 1.1 什么是过滤器？

过滤器是在类型检查之后、数据进入业务逻辑之前执行的**额外验证层**。

```typescript
// 基础类型检查：确保是字符串
Schema.String

// 添加过滤器：确保字符串长度 >= 10
Schema.String.pipe(
  Schema.filter(s => s.length >= 10 || "字符串至少需要10个字符")
)
```

### 1.1.1 关键特性

| 特性 | 说明 |
|------|------|
| **不改变类型** | 过滤器只添加约束，不修改 TypeScript 类型 |
| **可组合** | 多个过滤器可以链式组合 |
| **可自定义错误** | 可以返回字符串或结构化错误 |
| **支持路径** | 可以指定错误发生的字段路径 |

---

## 1.2 `Schema.filter` 的签名

```typescript
Schema.filter(
  predicate: (a: A, options, ast) => FilterReturnType,
  annotations?: FilterAnnotations
)
```

### 1.2.1 谓词函数的返回值类型

| 返回类型 | 含义 | 示例 |
|----------|------|------|
| `true` 或 `undefined` | ✅ 验证通过 | `s.length >= 10` |
| `false` | ❌ 验证失败，无具体消息 | `false` |
| `string` | ❌ 验证失败，返回错误字符串 | `"长度不足"` |
| `ParseIssue` | ❌ 返回结构化错误 | `new ParseResult.Type(...)` |
| `FilterIssue` | ❌ 带路径的错误 | `{ path: ["field"], message: "错误" }` |
| `Array<FilterOutput>` | ❌ 多个错误 | `[issue1, issue2]` |

---

## 1.3 简单示例

### 1.3.1 最小长度过滤器

```typescript
const LongString = Schema.String.pipe(
  Schema.filter(
    (s) => s.length >= 10 || "a string at least 10 characters long"
  )
)

decode(LongString)("a")
// 抛出: ParseError: a string at least 10 characters long
```

**注意**：类型仍然是 `string`，没有变成"长度≥10的字符串"。

### 1.3.2 添加注解

```typescript
const LongString = Schema.String.pipe(
  Schema.filter(
    (s) => s.length >= 10 || "a string at least 10 characters long",
    {
      identifier: "LongString",    // 错误消息中显示这个名字
      jsonSchema: { minLength: 10 }, // 生成 JSON Schema 时使用
      description: "A string with at least 10 characters"
    }
  )
)
```

---

## 1.4 带路径的错误

### 1.4.1 为什么需要路径？

在验证表单时，错误需要关联到具体的字段。

```typescript
const MyForm = Schema.Struct({
  password: Schema.String,
  confirm_password: Schema.String
}).pipe(
  Schema.filter((input) => {
    if (input.password !== input.confirm_password) {
      // 错误关联到 confirm_password 字段
      return {
        path: ["confirm_password"],
        message: "Passwords do not match"
      }
    }
  })
)

decode(MyForm)({
  password: "abc",
  confirm_password: "abd"
})
// 错误: confirm_password: Passwords do not match
```

---

## 1.5 多错误报告

一次返回多个验证错误：

```typescript
const MyForm = Schema.Struct({
  password: Schema.String,
  confirm_password: Schema.String,
  name: Schema.optional(Schema.String),
  surname: Schema.optional(Schema.String)
}).pipe(
  Schema.filter((input) => {
    const issues = []

    // 错误1：密码不匹配
    if (input.password !== input.confirm_password) {
      issues.push({
        path: ["confirm_password"],
        message: "Passwords do not match"
      })
    }

    // 错误2：缺少姓名
    if (!input.name && !input.surname) {
      issues.push({
        path: ["surname"],
        message: "Surname must be present if name is not present"
      })
    }

    return issues  // 返回多个错误
  })
)
```

输出：
```json
[
  { "path": ["confirm_password"], "message": "Passwords do not match" },
  { "path": ["surname"], "message": "Surname must be present..." }
]
```

---

## 1.6 内置过滤器

### 1.6.1 字符串过滤器

| 过滤器 | 作用 | 示例 |
|--------|------|------|
| `maxLength(n)` | 最大长度 | `maxLength(5)` |
| `minLength(n)` | 最小长度 | `minLength(5)` |
| `nonEmptyString()` | 非空字符串 | 等同于 `minLength(1)` |
| `length(n)` | 确切长度 | `length(5)` |
| `length({ min, max })` | 长度范围 | `length({ min: 2, max: 4 })` |
| `pattern(regex)` | 正则匹配 | `pattern(/^[a-z]+$/` |
| `startsWith(s)` | 以...开头 | `startsWith("prefix")` |
| `endsWith(s)` | 以...结尾 | `endsWith("suffix")` |
| `includes(s)` | 包含子串 | `includes("substring")` |
| `trimmed()` | 无前后空格 | 验证，不转换 |
| `lowercased()` | 全部小写 | 验证，不转换 |
| `uppercased()` | 全部大写 | 验证，不转换 |
| `capitalized()` | 首字母大写 | 验证，不转换 |
| `uncapitalized()` | 首字母小写 | 验证，不转换 |

### 1.6.2 数字过滤器

| 过滤器 | 作用 | 示例 |
|--------|------|------|
| `greaterThan(n)` | > n | `greaterThan(5)` |
| `greaterThanOrEqualTo(n)` | >= n | `greaterThanOrEqualTo(5)` |
| `lessThan(n)` | < n | `lessThan(5)` |
| `lessThanOrEqualTo(n)` | <= n | `lessThanOrEqualTo(5)` |
| `between(min, max)` | min ≤ x ≤ max | `between(-2, 2)` |
| `int()` | 整数 | `int()` |
| `nonNaN()` | 不是 NaN | `nonNaN()` |
| `finite()` | 有限数 | `finite()` |
| `positive()` | > 0 | `positive()` |
| `nonNegative()` | ≥ 0 | `nonNegative()` |
| `negative()` | < 0 | `negative()` |
| `nonPositive()` | ≤ 0 | `nonPositive()` |
| `multipleOf(n)` | 能被 n 整除 | `multipleOf(5)` |
| `Uint8` | 0-255 的整数 | 内置模式 |

### 1.6.3 数组过滤器

| 过滤器 | 作用 |
|--------|------|
| `maxItems(n)` | 最多 n 个元素 |
| `minItems(n)` | 至少 n 个元素 |
| `itemsCount(n)` | 恰好 n 个元素 |

### 1.6.4 日期过滤器

| 过滤器 | 作用 |
|--------|------|
| `validDate()` | 有效日期（非 Invalid Date） |
| `greaterThanDate(date)` | 晚于给定日期 |
| `greaterThanOrEqualToDate(date)` | 晚于或等于 |
| `lessThanDate(date)` | 早于给定日期 |
| `lessThanOrEqualToDate(date)` | 早于或等于 |
| `betweenDate(start, end)` | 在日期范围内 |

### 1.6.5 BigInt、BigDecimal、Duration 过滤器

类似的模式，针对各自的类型。

---

## 1.7 过滤器 vs 转换

| 特性 | 过滤器 (filter) | 转换 (transform) |
|------|-----------------|------------------|
| 修改类型 | ❌ 不修改 | ✅ 可以修改 |
| 添加验证 | ✅ 是 | 可选 |
| 修改值 | ❌ 不修改 | ✅ 可以修改 |

```typescript
// 过滤器：只验证，不修改值
const Filtered = Schema.String.pipe(
  Schema.filter(s => s.length >= 10 || "too short")
)

// 转换：可以修改值
const Transformed = Schema.String.pipe(
  Schema.transform(
    Schema.String,
    Schema.Number,
    { decode: Number, encode: String }
  )
)
```

---

## 1.8 访问基础模式

```typescript
const LongString = Schema.String.pipe(
  Schema.filter(s => s.length >= 10)
)

// 访问过滤器之前的模式
const from = LongString.from  // typeof Schema.String
```

---

## 1.9 完整示例：表单验证

```typescript
import { Schema, ParseResult, Either } from "effect"

const MyForm = Schema.Struct({
  email: Schema.String.pipe(Schema.pattern(/^[^@]+@[^@]+$/)),
  password: Schema.String.pipe(Schema.minLength(8)),
  confirm_password: Schema.String,
  age: Schema.Number.pipe(Schema.between(18, 120)),
  newsletter: Schema.Boolean
}).pipe(
  Schema.filter((input) => {
    const issues = []

    // 密码确认
    if (input.password !== input.confirm_password) {
      issues.push({
        path: ["confirm_password"],
        message: "Passwords do not match"
      })
    }

    // 年龄逻辑：如果订阅邮件，必须满21岁
    if (input.newsletter && input.age < 21) {
      issues.push({
        path: ["age"],
        message: "Must be 21 or older to subscribe to newsletter"
      })
    }

    return issues
  })
)

// 测试
const result = Schema.decodeUnknownEither(MyForm)({
  email: "invalid",
  password: "12345678",
  confirm_password: "12345679",
  age: 17,
  newsletter: true
})

if (Either.isLeft(result)) {
  console.log(ParseResult.ArrayFormatter.formatErrorSync(result.left))
}
// 输出多个结构化错误
```

---

## 1.10 核心要点总结

> **过滤器让你在类型检查之上添加自定义验证逻辑。可以返回字符串错误、结构化错误、带路径的错误，甚至多个错误。内置过滤器覆盖了常见的字符串、数字、数组、日期等验证需求。过滤器只验证，不修改类型或值。**