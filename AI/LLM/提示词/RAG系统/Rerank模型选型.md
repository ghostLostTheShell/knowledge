# Rerank（重排序）模型选型指南

Rerank（重排序）是现代 RAG 系统最重要的组件之一，它在 **检索之后、LLM 生成之前** 对候选文档进行“逐条打分”，大幅提升最终回答质量。

> **如果 Embedding 是“粗排”，Rerank 就是“精排”。**
> 双塔模型 vs Cross-Encoder 模型的区别是：
> **Rerank 看得到 Query & Passage 全交互，所以精度更高。**

---

# 一、为什么需要 Rerank？

即使你使用的是最强的 Embedding（如 BGE-M3、Qwen3、OpenAI V3），也会遇到：

* 检索结果似乎“相关但不精准”
* 内容“差一点点”就匹配不对问题
* RAG 的 hallucination（幻觉）依旧较高
* 文档分段后容易出现局部匹配错误

**引入 Rerank 后，效果通常能提升 20–40%**（真实测试数据）。

---

# 二、主流 Rerank 模型一览（2025 最新）

## 🔹 1. 商业 API

### **（1）Cohere Rerank（SOTA）**

最广泛使用的商业 Rerank 模型。

* 模型：`rerank-v3`（最新）
* 特点：

  * 极高的精度
  * 多语言强
  * API 简单
  * 与 Cohere Embedding 搭配优秀

适合需要顶级效果并接受商业 API 的团队。

---

### **（2）OpenAI Rerank（text-rerank-01）**

OpenAI 2024 推出的 Reranker。

* 多语言好
* 性能略弱于 Cohere，但与 OpenAI Embedding 配套好用
* 上下游生态强

---

## 🔹 2. 开源模型（可本地部署）

### **（1）BAAI BGE Rerank 系列（中文 SOTA）**

最强中文开源 Reranker：

* `bge-reranker-v2-m3`（最强）
* `bge-reranker-base`
* `bge-reranker-large`

特点：

* 中文表现极强，中文领域几乎稳居第一
* 与 BGE Embedding 完美配合
* 私有化部署简单

> **中文 RAG → 首选 bge-reranker-v2-m3**
> （比 Embedding 提升更大）

---

### **（2）Jina Reranker v2**

开源界的新星。

特点：

* 长文本能力极强（支持 >8k 字）
* 多语言优秀
* 性能逼近 Cohere

适合文档较长、语言复杂的企业级应用。

---

### **（3）Qwen-Reranker 系列（通义系列）**

和 Qwen Embedding 配套使用。

* `Qwen2.5-Reranker`
* `Qwen3-Reranker`（2025）

特点：

* 中文 + 多语言性能平衡
* 与 Qwen Embedding 使用体验一致

是国产生态中最均衡的组合之一（和 BGE 不冲突）。

---

### **（4）E5 Rerank（Microsoft）**

经典 cross-encoder 模型：

* `e5-mistral-rerank`
* `cross-encoder/ms-marco-MiniLM-L-6-v2`

特点：

* 中英表现不错
* 推理速度很快（适合实时系统）

缺点：

* 中文能力弱于 BGE、Qwen

---

### **（5）ColBERT（多向量 Rerank）**

更高级但更复杂的 rerank：

* 多向量检索
* 非单条评分，而是 token-level 的多重交互
* 适合复杂长文计算

缺点：资源需求高、工程复杂，不建议通用场景使用。

---

# 三、Rerank 怎么选？

下面给你一个清晰的决策树。

---

## ✔ 情况 1：中文为主（大部分中文业务）

**首选：BGE-reranker-v2-m3**

原因：

* 中文SOTA
* 经大量 RAG 项目验证
* 精度极高

---

## ✔ 情况 2：中英混合 + 多语言场景

**首选：Qwen2.5-reranker / Qwen3-reranker**
备选：Jina Reranker

---

## ✔ 情况 3：顶级效果，且愿意付费（商业 API）

**首选：Cohere rerank-v3**
备选：OpenAI text-rerank-01

---

## ✔ 情况 4：长文档（PDF/财报/法律文档）

**首选：Jina Reranker**
理由：支持最长文本 + 多轮交互评估

---

## ✔ 情况 5：延迟敏感、必须极快

**首选：MiniLM-L-6 reranker / E5-rerank**
原因：参数小、延迟低、GPU / CPU 都能跑

---

# 四、Rerank 在 RAG 中怎么用？（最佳实践）

**步骤：**

1. Embedding 粗排：从向量库取 **前 50 / 100 条**
2. Rerank 精排：得到最终 **Top 3–5 条**
3. 把内容输入 LLM（拼接或作为检索结果）

示例（伪代码）：

```python
embedding_results = vector_db.search(query, top_k=50)

reranked = reranker.rank(query, embedding_results)

top_docs = reranked[:5]
```

**注意：不要直接用 Reranker 去检索，因为它不是双塔模型，会很慢。**

---

# 五、推荐模型总结表（收藏级）

| 场景         | 首选模型                         | 理由      |
| ---------- | ---------------------------- | ------- |
| 中文精排 SOTA  | **bge-reranker-v2-m3**       | 中文最强、稳定 |
| 多语言 / 中英混合 | **Qwen2.5 / Qwen3 reranker** | 多语言能力强  |
| 顶级效果（商业）   | **Cohere rerank-v3**         | 全球评测第一  |
| 长文档        | **Jina Reranker**            | 超长上下文交互 |
| 轻量级、低延迟    | **MiniLM / E5 rerank**       | 小模型极快   |
| 开源性能均衡     | **Jina 或 BGE Base**          | 兼顾精度和速度 |

---