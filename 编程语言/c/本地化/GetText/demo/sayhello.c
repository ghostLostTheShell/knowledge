#include<stdio.h>
#include<locale.h>
#include<libintl.h>

/**
 * 
 * 
 */
#define _(S) gettext(S)

#define PACKAGE "sayhello"

int main(int argc, char const *argv[])
{
  /* code */
  /**
   *设置locale和mo文件将要存放的路径，关联程序 
   */
  setlocale(LC_ALL, "");
  bindtextdomain(PACKAGE, "locale");
  textdomain(PACKAGE);

  printf(_("Hello,GetText!\n"));
  
  return 0;
}



