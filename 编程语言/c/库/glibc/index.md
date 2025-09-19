# glibc

## 字符处理
[文档](https://developer.gnome.org/glib/stable/glib-Strings.html)

### g_strdup_printf

``` c
#include <stdio.h>
#include <glib.h>
     
int main() {
        char *a = "aaaaaaaaaaa";
        gchar *t = g_strdup_printf ("%s", a);
        printf("%s", t);
        g_free(t)
}
```