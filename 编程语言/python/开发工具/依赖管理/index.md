
## 一、主流与现代化工具（推荐使用）

这些是目前最流行、最被推荐的工具，它们解决了传统工具的很多痛点。

## 1. **Poetry**
**定位**：目前最主流的**一体化**现代依赖管理工具，旨在取代 `pip` + `virtualenv` + `setup.py` 的复杂工作流。

**核心特点**：
*   **一体化**：同时处理依赖管理、打包和发布。
*   **确定性锁定**：使用 `poetry.lock` 文件确保所有环境（开发、生产）安装完全一致的依赖树。
*   **清晰的依赖分离**：在 `pyproject.toml` 中明确区分生产依赖和开发依赖。
*   **优秀的解析器**：依赖解析算法非常强大，能快速找到兼容的版本组合。

**基本工作流**：
```bash
# 1. 安装 Poetry
pip install --user poetry

# 2. 为新项目初始化（会创建 pyproject.toml 文件）
poetry new my-project
cd my-project

# 3. 添加生产依赖
poetry add requests

# 4. 添加开发依赖（如 pytest, black）
poetry add --group dev pytest

# 5. 安装所有依赖（并生成/更新 lock 文件）
poetry install

# 6. 在虚拟环境中运行命令
poetry run python my_script.py
# 或激活虚拟环境
poetry shell
```

**适用场景**：绝大多数新项目，尤其是需要打包和发布的库或应用。

---

## 2. **PDM**
**定位**：一个同样现代化的、理念先进的依赖管理工具，在某些方面比 Poetry 更灵活。

**核心特点**：
*   **极快的安装速度**：默认使用本地包缓存，无需创建虚拟环境（可选），安装速度极快。
*   **符合 PEP 标准**：严格遵循 `pyproject.toml` 标准，不像 Poetry 有一些自定义扩展。
*   **灵活的环境管理**：对虚拟环境的控制更灵活，可以复用系统环境。
*   **支持 Monorepo**：对多包项目支持更好。

**基本工作流**：
```bash
# 1. 安装 PDM
pip install --user pdm

# 2. 初始化项目
pdm init

# 3. 添加依赖
pdm add requests
pdm add -dG dev pytest

# 4. 安装依赖
pdm install

# 5. 运行
pdm run python my_script.py
```

**适用场景**：追求极致速度、严格遵循标准、或需要复杂工作流（如 Monorepo）的项目。

---

## 3. **UV**
**定位**：一个用 Rust 编写的**极速** Python 包解析器和安装器，由 Astral 公司（ Ruff 的创建者）开发。

**核心特点**：
*   **速度极快**：比传统的 `pip` 和 `poetry` 快一个数量级。
*   **兼容 pip 工作流**：可以作为 `pip` 和 `pip-tools` 的替代品，学习成本低。
*   **一体化**：也内置了虚拟环境管理和项目初始化功能。
*   **未来之星**：发展迅速，有望成为未来的行业标准。

**基本工作流**：
```bash
# 1. 安装 uv (方法多种，以下是其一)
curl -LsSf https://astral.sh/uv/install.sh | sh

# 2. 初始化项目并创建虚拟环境
uv init my-project
cd my-project

# 3. 添加依赖 (会更新 pyproject.toml 和 uv.lock)
uv add requests

# 4. 同步依赖（根据 lock 文件安装）
uv sync

# 5. 运行
uv run python my_script.py
```

**适用场景**：任何对依赖安装速度有要求的项目，尤其是 CI/CD 流水线。

---

## 二、传统与基础工具（需要了解）

这些是 Python 生态的基础，很多旧项目仍在使用，但新项目通常不再推荐单独使用它们。

## 1. **`requirements.txt` + `pip`**
**定位**：最基础、最广为人知的依赖管理方式。

**痛点**：
*   **需要手动维护**：依赖及其版本需要手动编写。
*   **没有锁定传递依赖**：只记录了直接依赖，无法保证传递依赖的版本一致性，可能导致“在我机器上是好的”问题。
*   **需结合其他工具**：需要与 `virtualenv` 或 `venv` 配合使用来隔离环境。

**工作流**：
```bash
# requirements.txt 文件内容
requests==2.31.0
flask>=2.0.0
pytest~=7.0.0  # 近似于 7.0.x

# 安装
python -m venv .venv
source .venv/bin/activate  # Linux/Mac
# .venv\Scripts\activate    # Windows
pip install -r requirements.txt
```

**改进工具：`pip-tools`**
它通过 `requirements.in` 文件生成确定性的 `requirements.txt`，解决了锁定问题。
```bash
# 在 requirements.in 中写主依赖
requests
flask

# 编译生成精确的 requirements.txt
pip-compile requirements.in

# 安装
pip-sync
```

---

## 2. **`setup.py` / `setup.cfg` + `setuptools`**
**定位**：传统的项目打包和分发方式，也用于声明安装依赖。

**现状**：正逐渐被 `pyproject.toml`（遵循 **PEP 621**）所取代。现代工具如 Poetry、PDM 最终也是生成符合此标准的 `pyproject.toml` 文件。

---

## 总结与选择建议

| 工具 | 哲学 | 锁定文件 | 虚拟环境 | 学习曲线 | 推荐场景 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`Poetry`** | **一体化，省心** | `poetry.lock` | 自动管理 | 中等 | **绝大多数新项目**的首选 |
| **`PDM`** | **快速，标准，灵活** | `pdm.lock` | 灵活管理 | 中等 | 追求速度和 PEP 严格合规 |
| **`UV`** | **极致速度** | `uv.lock` | 自动管理 | 低 | **追求极致性能**，CI/CD，未来导向 |
| **`pip-tools`** | **改进传统工作流** | `requirements.txt` | 需手动 | 低 | 改进现有基于 `requirements.txt` 的项目 |
| **`pip` + `venv`** | **基础，内置** | 无（需手动） | 需手动 | 低 | **初学者学习**，简单脚本 |

**给新项目的建议：**

1.  **无脑选择 Poetry**：它的生态最完善，社区最大，遇到问题最容易找到解决方案。
2.  **追求前沿和速度**：可以尝试 **UV**，它代表了未来的方向，而且速度优势巨大。
3.  **坚守 Python 标准**：可以选择 **PDM**，它对 PEP 标准的遵循最严格。

对于初学者，从 `pip` + `venv` 开始理解概念是很好的，但一旦开始正式的项目，强烈建议直接切换到 **Poetry** 或 **UV**，它们会为你省去无数麻烦。