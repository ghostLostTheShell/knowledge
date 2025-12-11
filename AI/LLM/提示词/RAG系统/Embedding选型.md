Embedding 模型（文本向量化模型）是现代 AI 应用（特别是 RAG、语义搜索、聚类）的基石。选择合适的模型需要平衡**性能（准确率）、成本、速度、语言支持**和**上下文长度**。

以下是目前主流的 Embedding 模型盘点以及详细的选型指南。

---

### 一、 都有哪些主流模型？

目前市场主要分为 **闭源商业 API** 和 **开源模型（可本地部署）** 两大阵营。

#### 1. 闭源商业 API (SaaS)
适合不想维护基础设施、追求快速上线、对数据隐私不极其敏感的场景。

*   **OpenAI (`text-embedding-3-small` / `large`)**
    *   **特点：** 目前最通用的标准。第3代模型支持**弹性维度**（Matryoshka Embeddings），可以缩短向量长度以节省数据库存储，同时保持性能。价格非常便宜。
    *   **优势：** 极其稳定，生态支持最好，多语言支持尚可。
*   **Cohere (`embed-multilingual-v3.0`, `embed-english-v3.0`)**
    *   **特点：** 专为 RAG 优化，与其 Rerank（重排序）模型配合使用效果极佳。
    *   **优势：** 多语言能力强，特定的检索任务表现优秀。
*   **Google Vertex AI (`Gecko`)**
    *   **特点：** Google 的多语言模型，在跨语言检索上表现不错。

#### 2. 开源/可本地部署模型 (SOTA)
适合需要数据隐私、降低长期成本、或追求特定领域高性能的场景。主要在 Hugging Face 上下载。

*   **BGE 系列 (BAAI/智源研究院)**
    *   **型号：** `bge-m3` (最强), `bge-large-zh-v1.5`, `bge-base`
    *   **特点：** **中文领域目前的王者**。BGE-M3 支持多语言、长文本（8192 tokens），且支持稠密检索（Dense）、稀疏检索（Sparse）和多向量检索（ColBERT style）。
    *   **适用：** 中文或中英混合场景的首选。
*   **E5 系列 (Microsoft/Intfloat)**
    *   **型号：** `e5-mistral-7b-instruct`, `multilingual-e5-large`
    *   **特点：** 也是中文和多语言表现极佳的模型。通常需要加前缀 `query:` 和 `passage:` 来区分输入类型。
*   **Jina AI (`jina-embeddings-v3`)**
    *   **特点：** 专为长文本设计（8192 tokens），支持多种任务（分类、检索、聚类）的 LoRA 适配器。性能在 MTEB 榜单上非常靠前。
*   **Nomic (`nomic-embed-text-v1.5`)**
    *   **特点：** 只有 137M 参数但支持 8192 上下文，且支持可变维度。是一个非常高性价比的长文本开源模型。
*   **M3E (MokaAI)**
    *   **特点：** 早期中文开源界的常用模型，体积小，适合纯中文通用场景，但目前已被 BGE 超越。
* **Qwen / Qwen-Embedding 系列**
    * BGE-M3 中文略强，Qwen2.5 多语言更均衡；两者都是顶级 SOTA
---

### 二、 怎么选？（选型维度的 5 个关键点）

在选择模型时，请依次考虑以下 5 个问题：

#### 1. 看榜单：MTEB (Massive Text Embedding Benchmark)
这是全球公认的 Embedding 评测榜单。
*   **怎么看：** 不要只看总分（Average）。
    *   如果你做 RAG，重点看 **Retrieval**（检索）分数。
    *   如果你做聚类，看 **Clustering** 分数。
    *   **链接：** [Hugging Face MTEB Leaderboard](https://huggingface.co/spaces/mteb/leaderboard)

#### 2. 语言支持 (Language)
*   **纯英文：** OpenAI, Cohere, E5-mistral 表现都很好。
*   **纯中文/中英混合：** **强烈推荐 BGE 系列**（如 `bge-m3` 或 `bge-large-zh-v1.5`）。OpenAI 在中文理解上不如国产的 BGE 精细。

#### 3. 上下文长度 (Context Window)
*   **短文本（< 512 tokens）：** 大多数模型都支持，选 BGE-base 或 OpenAI small 即可，速度快。
*   **长文本（法律文档、财报、书籍）：** 需要支持长上下文的模型，否则文本会被截断。
    *   **推荐：** `jina-embeddings-v3` (8k), `nomic-embed-text` (8k), `OpenAI text-embedding-3` (8k)。

#### 4. 部署方式与隐私 (Privacy & Infrastructure)
*   **数据极度敏感（金融/医疗/政务）：** 必须私有化部署。选择 **BGE** 或 **E5**，运行在本地 GPU 上。
*   **快速验证/初创公司：** 直接调 **OpenAI API**。虽然 `text-embedding-3` 很便宜，但要注意随着数据量也就是 Token 数的爆炸，API 成本会线性增长。

#### 5. 向量维度与数据库成本 (Dimensions)
向量维度决定了向量数据库（Vector DB）的存储成本和检索速度。
*   **维度越高：** 信息量越大，越精准，但存储越贵，检索越慢（如 1536, 1024 维）。
*   **维度越低：** 速度快，便宜（如 384, 512, 768 维）。
*   *Tip:* 如果预算有限，使用支持 **Matryoshka** 技术的模型（OpenAI v3, BGE-M3, Nomic），可以将高维向量截断成低维（如从 1536 截断到 512），性能损失很小。

---

### 三、 场景化推荐总结

为了帮你快速决策，以下是针对不同场景的“抄作业”推荐：

#### 场景 A：我是新手 / 只有少量数据 / 快速做 Demo
*   **选择：** **OpenAI `text-embedding-3-small`**
*   **理由：** 便宜、无需运维、标准 API、效果足够好。

#### 场景 B：我主要处理中文业务 / 需要私有化部署 / 追求高性能
*   **选择：** **BGE-M3** (资源充足) 或 **BGE-large-zh-v1.5**
*   **理由：** 智源 BGE 是目前中文开源语义检索的天花板，且 M3 支持混合检索（Dense + Sparse），能解决关键词匹配不到的问题。

#### 场景 C：我有大量长文档（PDF、书籍）
*   **选择：** **Jina Embeddings v3** 或 **Nomic Embed v1.5**
*   **理由：** 这两款模型在 8192 长度的窗口下表现非常稳定，且对硬件要求相对友好。

#### 场景 D：边缘设备部署（手机、树莓派、低配服务器）
*   **选择：** **BGE-micro** 或 **All-MiniLM-L6-v2**
*   **理由：** 模型参数极小，推理速度极快，虽然精度不如大模型，但在资源受限场景下是唯一选择。

### 四、 进阶建议：不要忽略 Rerank（重排序）

如果你发现 Embedding 检索出来的结果总是差一点点，**不要盲目更换 Embedding 模型**，而是应该引入 **Rerank 模型**。

*   **流程：** 先用 Embedding 检索出前 50 个结果（粗排），再用 Rerank 模型对这 50 个结果进行精细打分（精排），取前 3 个给 LLM。
*   **推荐 Rerank 模型：** `bge-reranker-v2-m3` (开源), Cohere Rerank (商业API)。