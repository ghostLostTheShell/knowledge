# Getting Started | 入门

欢迎使用 Effect 库！Effect 是 TypeScript 的一个库，用于帮助开发者构建异步应用程序。

本文档帮助你快速开始使用 Effect 库。

## 为什么选择 Effect？

Effect 是一个强大的 TypeScript 库，旨在帮助开发者轻松创建复杂的同步和异步程序。

Effect 的一些主要特征：

| 特性 | 描述 |
|------|------|
| 并发 | 通过 Effect 的基于纤维（fiber）的高级并发模型实现高度可扩展、超低延迟的应用 |
| 组合性 | 使用小型可复用构建块组合高度可维护、易读且灵活的软件 |
| 资源安全 | 即使程序失败，也能安全地管理资源的获取和释放 |
| 类型安全 | 充分利用 TypeScript 类型系统，Effect 专注于类型推断和类型安全 |
| 错误处理 | 使用 Effect 内置的错误处理能力以结构化且可靠的方式处理错误 |
| 异步性 | 编写同步或异步看起来相同的代码 |
| 可观测性 | 通过完整的追踪功能，轻松调试和监控 Effect 程序的执行 |

Effect vs ZIO / fp-ts / Promise

- **优于 Promise**：Promise 只支持基本的异步操作，Effect 提供了强大的函数式编程能力和类型安全
- **优于 fp-ts**：fp-ts 专注于纯函数，Effect 提供了更好的生产过程和错误处理
- **优于 ZIO**：Effect 没有 Zendesk 支持问题，有更好的 API 和更好的类型推断

## 安装

从包管理器安装 Effect：

```bash
# npm
npm install effect

# yarn
yarn add effect

# pnpm
pnpm add effect
```

## 导入 Effect

```typescript
import * as Effect from "effect/Effect";
import type { Effect } from "effect";
// 或者
import { pipe } from "effect/Function";
```

## 运行 Effects

在 Effect 中使用代码时，需要运行你的 Effect。

```typescript
import * as Effect from "effect/Effect";

// 创建一个 Effect
const myEffect = Effectละoss.string("hello");

// 运行它
const result = await Effect.runPromise(myEffect);
```

## 生成器

Effect 支持生成器的 yield，这使得代码逻辑可以更加清晰和易于阅读。

```typescript
const result = await Effect.forEach([1, 2, 3], (n) => Effect.effect).pipe(Effect.runPromise);
```

## 构建管道

Effect 提供了丰富的函数式操作，可以方便地组合多个操作。

```typescript
const pipeline = pipe(
  Effect.effect,
  Effect.flatMap(parse),
  Effect.flatMap(validate),
  Effect.map(unwrap)
);
```

## 控制流操作符

Effect 提供了一系列控制流操作符，如：

- `Effect.filterMap` - 过滤并映射
- `Effect.sort` - 对效果排序
- `Effect.timeout` - 超时控制
- 等等更多...

## 目录结构

Effect 库包含以下主要特性：

### 入门
- **简介** - Effect 库概述和基本概念
- **为什么选择 Effect？** - Effect 库的特点和优势
- **安装** - 如何安装 Effect 库
- **开发工具** - Effect 库的开发工具
- **引入 Effect** - 如何正确引入 Effect 库
- **Effect 类型** - Effect 类型的使用和示例
- **创建 Effects** - 如何创建 Effect
- **运行 Effects** - 如何运行 Effect
- **使用生成器** - 如何在 Effect 中使用生成器
- **构建管道** - 如何构建 Effect 管道
- **控制流操作符** - Control flow operators

### 错误管理
- **两种错误类型** - 预期错误和非预期错误
- **预期错误** - 预期错误处理
- **非预期错误** - 非预期错误处理
- **回退** - 错误回退策略
- **匹配** - 错误模式匹配
- **重试** - 自动重试机制
- **设置超时** - 超时管理
- **沙盒** - 错误隔离
- **错误累积** - 错误累积处理
- **错误通道操作** - 错误通道的高级操作
- **并行和顺序错误** - 并发错误处理
- **可传递的错误** - 错误传递机制

### 需求管理
- **管理服务** - Effect 库服务管理
- **默认服务** - 默认服务配置
- **管理分层** - 分层架构管理
- **分层 memoization** - 分层缓存优化

### 资源管理
- **简介** - 资源管理概述
- **作用域** - 作用域概念

### 可观测性
- **日志** - 日志记录和调试
- **指标** - 性能指标监控
- **追踪** - 分布式追踪支持
- **监控器** - 异常监控和分析

### 配置
- 配置文件管理

### 运行时
- 运行时配置和选项

### 调度
- **简介** - 调度基本概念
- **重复** - 重复调度策略
- **内置调度** - 内置调度器
- **调度组合器** - 调度组合操作
- **Cron** - Cron 表达式支持
- **示例** - 调度示例代码

### 状态管理
- **Ref** - 引用类型状态管理
- **SynchronizedRef** - 同步引用状态
- **SubscriptionRef** - 订阅状态管理

### 批处理
- 批量操作处理

### 缓存
- **缓存 Effects** - Effect 缓存策略
- **缓存** - 通用缓存机制

### 并发
- **基本并发** - 并发基础概念
- **纤维** - Fiber 并发模型
- **Deferred** - Deferred 信号量
- **队列** - 并发队列管理
- **发布订阅** - 发布订阅模式
- **信号量** - 并发信号量控制
- **闩锁** - Latch 同步机制

### 流
- **简介** - 流处理概述
- **创建流** - 创建流的方法
- **消费流** - 消费流的方法
- **错误处理** - 流的错误处理
- **操作** - 流的各种操作
- **有资源的流** - 资源管理的流

### 汇聚器
- **简介** - 汇聚器基础
- **创建汇聚器** - 创建汇聚器的方法
- **操作** - 汇聚器的各种操作
- **并发** - 汇聚器的并发处理
- **剩余数据** - 处理剩余数据

### 测试
- **TestClock** - 测试时钟支持

### 代码风格
- **指南** - 代码风格指南
- **双 API** - 同步/异步 API
- **品牌类型** - Brand Types
- **模式匹配** - 模式匹配技巧
- **过度嵌套** - 避免过度嵌套

### 数据类型
- **BigDecimal** - 高精度小数
- **Cause** - 错误原因描述
- **Chunk** - 数组缓冲区
- **Data** - 动态数据
- **DateTime** - 日期时间
- **Duration** - 时间间隔
- **Either** - Either 类型
- **Exit** - 退出状态
- **HashSet** - Hash 集合
- **Option** - Option 类型
- **Redacted** - 敏感信息隐藏

### 特质
- **Equal** - 相等性比较
- **Hash** - Hash 哈希

### 行为
- **等价性** - 等价性关系
- **序** - 顺序关系

### Schema
- **简介** - Schema 概述
- **入门** - Schema 快速入门
- **基础用法** - Schema 基本使用
- **过滤器** - Schema 过滤器
- **高级用法** - Schema 高级特性
- **投射** - Schema 类型投射
- **变换** - Schema 数据变换
- **注解** - Schema 元数据注解
- **错误消息** - 错误消息定制
- **错误格式化器** - 错误格式化
- **类 API** - Schema 类接口
- **默认构造函数** - 默认构造器
- **Effect 数据类型** - Effect 相关 Schema
- **标准模式** - 内置标准 Schema
- **任意值生成** - Arbitrary 测试数据
- **JSON Schema** - JSON Schema 导出
- **等价性** - Schema 等价性检查
- **美化器** - Schema 格式化输出

### AI Unstable
- **简介** - AI 功能概述
- **入门** - AI 快速入门
- **执行规划** - LLM 交互规划
- **工具使用** - 工具调用支持

### Micro Unstable
- **入门** - Micro 库概述
- **面向 Effect 使用者的 Micro** -如何开始使用

### Platform Unstable
- **简介** - Platform 概述
- **命令** - 命令行接口
- **文件系统** - 文件系统操作
- **键值存储** - 键值存储抽象
- **路径** - 路径处理
- **平台日志** - 平台日志
- **运行时** - 平台运行时
- **终端** - 终端交互式

### 其他资源
- **误区** - 常见误区澄清
- **API 参考** - 完整 API 文档
- **来自 ZIO** - 从 ZIO 迁移指南
- **Effect vs fp-ts** - 与 fp-ts 对比
- **Effect vs Promise** - 与 Promise 对比
- **Effect vs neverthrow** - 与 neverthrow 对比

---

更多内容请查看完整的 Effect 文档。

可以访问 [Effect 官方网站文档](https://effect.website/docs) 获取更多信息。

也可以访问 [Discord](https://discord.gg/effect-ts) 社区获取帮助。
