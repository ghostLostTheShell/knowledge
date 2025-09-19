//weak.c
#include <stdio.h>
void print_hello(const char *s) __attribute__((weak, alias("__weak_hello")));
void print_world(const char *s) __attribute__((weak, alias("__weak_hello")));
void __weak_hello(const char *)
{
printf("__weak_hello: %s\n", s);
}
//weak.c end
