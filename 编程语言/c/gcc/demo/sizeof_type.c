/**
 * @file sizeof_type.c
 * @author your name (you@domain.com)
 * @brief 
 * @version 0.1
 * @date 2021-02-26
 * 
 * @copyright Copyright (c) 2021
 * 
 * 查看各种类型的长度
 */
#include <stdio.h>

int main(int argc, char const *argv[])
{
  short Short;
  int Int;
  long Long;
  long int long_int;
  long long int long_long_int;

  
  printf("short size %ld\n", sizeof(Short)); 
  printf("INT size %ld\n", sizeof(Int));
  printf("long size %ld\n", sizeof(Long));
  printf("long_int size %ld\n", sizeof(long_int));
  printf("long_long_int size %ld\n", sizeof(long_long_int));

  /* code */
  return 0;
}
