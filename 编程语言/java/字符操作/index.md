# 字符操作

## StringBuffer

### 清空StringBuffer

```java

StringBuffer sb = new StringBuffer("");
//1.直接把长度设置为0 推荐
sbi.setLength(0)
//2.
sb.delete(0, sb.length())

```