# 例子

---

## register volatile gd_t *gd asm ("x18")

这个声明告诉编译器使用寄存器r8来存储gd_t类型的指针gd，即这个定义声明了一个指针，并且指明了它的存储位置。

register表示变量放在机器的寄存器

volatile用于指定变量的值可以由外部过程异步修改

---
