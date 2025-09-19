import sys
from PyQt5.QtWidgets import QApplication, QWidget, QGridLayout, QPushButton


class Winform(QWidget):
    def __init__(self, parent=None):
        super(Winform, self).__init__(parent)
        self.initUI()

    def initUI(self):
        # 1创建QGridLayout的实例，并设置窗口的布局
        grid = QGridLayout()
        grid.setSpacing(0)
        self.setLayout(grid)

        # 2创建按钮的标签列表
        names = ['Cls', 'Back', '', 'Close',
                 '7', '8', '9', '/',
                 '4', '5', '6', '*',
                 '1', '2', '3', '-',
                 '0', '.', '=', '+']

        # 3 在网格中创建一个位置列表
        positions = [(i, j) for i in range(5) for j in range(4)]

        # 4 创建按钮并通过addWIdget（）方法添加到布局中
        for position, name in zip(positions, names):
            if name == '':
                continue

            button = QPushButton(name)
            # *position
            grid.addWidget(button, *position)

        self.move(300, 150)
        self.setWindowTitle('网格布局管理例子')


if __name__ == "__main__":
    app = QApplication(sys.argv)
    form = Winform()
    form.show()
    sys.exit(app.exec_())
