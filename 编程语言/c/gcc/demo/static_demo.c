/**
 * @file static_demo.c
 *  static 的用法
 * @author your name (you@domain.com)
 * @brief 
 * @version 0.1
 * @date 2021-02-25
 * 
 * @copyright Copyright (c) 2021
 * 
 */

#include <stdio.h>

int count();

int main(int argc, char const *argv[])
{
  /* code */
  for(int i = 0; i < 6; i++){

    printf("%d \n", count());

  }

  return 0;
}

int count(){
  /**
   * 保持变量内容的持久性
   */
  static int num = 0; //只初始一次
  return num++;
}
