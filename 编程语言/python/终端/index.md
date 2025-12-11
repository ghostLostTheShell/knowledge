

## 类别 1：基础输出与颜色

这类库主要用于在终端输出带颜色和样式的文本。

### 1. **内置 `colorama` (跨平台)**
**特点**：最基础的跨平台颜色库，让 Windows 终端也支持 ANSI 转义序列。
**使用场景**：快速为脚本添加简单的颜色，无需复杂功能。
```python
from colorama import Fore, Back, Style, init
init(autoreset=True)  # 自动重置样式

print(Fore.RED + '这是红色文字')
print(Back.GREEN + '这是绿色背景')
print(Style.BRIGHT + Fore.BLUE + '这是亮蓝色')
```

### 2. **`rich`**
**特点**：**功能极其强大**的终端美化库，是目前该领域的王者。
**使用场景**：几乎所有需要美化终端输出的情况。
```python
from rich.console import Console
from rich.table import Table
from rich.progress import track
from rich.syntax import Syntax
import time

console = Console()

# 1. 彩色输出
console.print("[bold red]警告！[/bold red] 这是一个提示。")

# 2. 创建表格
table = Table(title="明星数据库")
table.add_column("姓名", style="cyan")
table.add_column("职业", style="magenta")
table.add_row("周杰伦", "歌手、音乐人")
table.add_row("刘德华", "演员、歌手")
console.print(table)

# 3. 进度条
for i in track(range(10), description="处理中..."):
    time.sleep(0.1)

# 4. 代码高亮
code = """
def hello(name):
    print(f"Hello, {name}!")
"""
syntax = Syntax(code, "python", theme="monokai", line_numbers=True)
console.print(syntax)
```

### 3. **`termcolor`**
**特点**：非常轻量级的颜色库，API 简单。
**使用场景**：只需要基础颜色，不想引入像 `rich` 这样的“庞然大物”。
```python
from termcolor import colored
print(colored('这是红色文字', 'red'))
print(colored('这是蓝色背景', 'blue', 'on_yellow'))
```

---

## 类别 2：光标控制与交互

这类库可以移动光标、清屏、获取键盘事件，用于创建动态界面。

### 1. **`cursor`**
**特点**：超轻量级，专门用于隐藏和显示终端光标。
**使用场景**：在显示进度动画或自定义输入时隐藏闪烁的光标。
```python
from cursor import hide, show
import time

hide()  # 隐藏光标
print("光标消失了...")
time.sleep(2)
show()  # 显示光标
print("光标回来了！")
```

### 2. **`blessed`**
**特点**：一个功能齐全的终端抽象层，可以看作是 `curses` 的现代化替代品。
**使用场景**：需要跨终端兼容性的复杂交互应用。
```python
from blessed import Terminal
import time

term = Terminal()

with term.fullscreen(), term.cbreak():
    print(term.clear)
    print(term.move_yx(5, 10) + "按任意键退出")
    val = None
    while not val:
        # 显示实时大小
        print(term.move_yx(7, 10) + f"终端大小: {term.width} x {term.height}")
        # 非阻塞获取输入
        val = term.inkey(timeout=0.5)
    print(f"你按下了: {val}")
```

### 3. **`keyboard`**
**特点**：可以监听全局键盘事件（不限于终端）。
**使用场景**：需要捕获全局热键或复杂键盘输入的程序。
```python
import keyboard

# 注册热键
keyboard.add_hotkey('ctrl+shift+a', lambda: print('热键被触发！'))

# 阻塞等待特定按键
keyboard.wait('esc')
print("退出")
```

---

## 类别 3：高级组件与布局

这类库提供了更高级的 UI 组件，如输入框、选择列表等。

### 1. **`prompt_toolkit`**
**特点**：构建交互式命令行应用的**终极工具**，是许多知名库（如 IPython, pgcli）的基础。
**使用场景**：需要实现复杂的 REPL、自定义 Shell 或任何有丰富交互的命令行工具。
```python
from prompt_toolkit import prompt
from prompt_toolkit.formatted_text import HTML
from prompt_toolkit.shortcuts import yes_no_dialog, message_dialog
from prompt_toolkit.history import FileHistory

# 1. 带提示和历史的输入
name = prompt('请输入你的名字: ', history=FileHistory('history.txt'))

# 2. 带 HTML 样式的提示
prompt_html = prompt(HTML('<ansired><b>年龄:</b></ansired> '))

# 3. 对话框
result = yes_no_dialog(title='确认', text='你确定要继续吗？').run()
if result:
    message_dialog(title='结果', text='你选择了“是”').run()
```

### 2. **`questionary`**
**特点**：基于 `prompt_toolkit`，但 API 更简单友好，专门用于创建漂亮的交互式提示。
**使用场景**：快速为脚本添加各种形式的用户输入。
```python
import questionary

# 各种交互式问题
name = questionary.text("你叫什么名字?").ask()
language = questionary.select(
    "你最喜欢的编程语言是?",
    choices=["Python", "JavaScript", "Rust", "Haskell"],
).ask()
skills = questionary.checkbox(
    "选择你掌握的技能:",
    choices=["HTML", "CSS", "SQL", "Git"],
).ask()

print(f"你好 {name}, 你喜欢 {language}, 技能是 {', '.join(skills)}")
```

---

## 类别 4：全屏文本用户界面

这类库用于构建像 `htop` 或 `vim` 那样的复杂全屏应用。

### 1. **`textual`**
**特点**：由 `rich` 同一作者开发，用于构建**功能齐全的 TUI 应用**。它引入了 CSS-like 的样式系统和组件化开发模式，是当前最现代的 TUI 框架。
**使用场景**：构建复杂的全屏终端应用，如系统监控仪表盘、终端邮件客户端等。
```python
from textual.app import App, ComposeResult
from textual.widgets import Header, Footer, Label, Button

class HelloApp(App):
    CSS = """
    Screen {
        background: blue;
    }
    Label {
        width: 100%;
        content-align: center middle;
        color: white;
    }
    """

    def compose(self) -> ComposeResult:
        yield Header()
        yield Label("Hello, Textual!")
        yield Button("点击我")
        yield Footer()

    def on_button_pressed(self) -> None:
        self.query_one(Label).update("按钮被点击了！")

if __name__ == "__main__":
    app = HelloApp()
    app.run()
```

### 2. **`asciimatics`**
**特点**：专门用于创建**复古风格的动画和可视化效果**，支持鼠标、视觉效果和简单 UI 组件。
**使用场景**：制作终端动画、演示文稿、复古游戏。
```python
from asciimatics.screen import Screen
from asciimatics.scene import Scene
from asciimatics.effects import Print
from asciimatics.renderers import FigletText
import time

def demo(screen):
    effects = [
        Print(screen, FigletText("HELLO", font="big"),
              x=screen.width // 2 - 20, y=screen.height // 2 - 8,
              start_frame=0, stop_frame=100)
    ]
    screen.play([Scene(effects, 100)])

Screen.wrapper(demo)
```

---

### 总结与选择建议

| 你的需求 | 推荐库 | 原因 |
| :--- | :--- | :--- |
| **只想给输出加点颜色** | `colorama`, `termcolor` | 轻量、简单 |
| **想要漂亮的表格、进度条等** | **`rich`** | 功能强大、开箱即用 |
| **需要自定义输入、自动补全** | **`prompt_toolkit`** | 功能最全、工业级 |
| **快速创建交互式问答** | **`questionary`** | API 简单、优雅 |
| **构建全屏应用（如 htop）** | **`textual`** | 现代、强大、有 CSS 支持 |
| **制作终端动画/复古效果** | `asciimatics` | 特效丰富、支持动画 |

**对于新项目，我的建议是：**

1.  从 `rich` 开始，它能解决 80% 的终端美化需求。
2.  如果需要复杂交互，结合 `prompt_toolkit` 或 `questionary`。
3.  如果要构建真正的全屏应用，直接上 `textual`。

Python 的终端库生态已经非常成熟，你可以用它们创造出令人惊叹的命令行用户体验！