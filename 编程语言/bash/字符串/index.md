
- 字符串按位置切片

  `${var:offset:length}`

  offset：从第几个开始切
  
  length：切多长。可以是负数（从最右面开始切多长，注意负号和冒号之间必须有空格）。

- 字符串按模式切片
  
  `${var#pattern}`
   
   自左而右，查找var变量所存储的字符串中，第一次出现的pattern，删除pattern所匹配到的所有字符。 注意：匹配到的必须是从行首开始的，不能匹配中间某段。

  `${var##pattern}`
  
  贪婪模式，匹配到不能再匹配到位置。


  `${var%pattern}`
  
  自右而左，查找var变量所存储的字符串中，第一次出现的pattern，删除pattern所匹配到的所有字符。 注意：匹配到的必须是从行尾开始的，不能匹配中间某段。

  `${var%%pattern}`
  
  贪婪模式，匹配到不能再匹配到位置。

  模式：

  - *：代表0个或多个任意字符。
  - ?：代表0个或1个任意字符。

- 字符串替换

  `${var/pattern/substr}`
  
  首次。查找var所表示的字符串中，第一次被pattern所匹配到的字符串，以substr替换之。

  `${var//pattern/substr}`
  
  全部。查找var所表示的字符串中，所有能被pattern所匹配到的字符串，以substr替换之。

  `${var/#pattern/substr}`
  
  行首。查找var所表示的字符串中，行首被pattern所匹配到的字符串，以substr替换之。

  `${var/%pattern/substr}`
  
  行尾。查找var所表示的字符串中，行尾被pattern所匹配到的字符串，以substr替换之。

- 字符大小写转换

  `${var^^}`

  把var中的所有小写字母转换为大写。

  `${var,,}`
  
  把var中的所有大写字母转换为小写。


- 变量赋值

  ${var:-VALUE}
  
  如果变量var为空或者未设置，则返回VALUE；否则返回变量var的值。注意，变量var本身的值不会被修改。

  ${var:=VALUE}
  
  如果变量var为空或者未设置，则返回VALUE，并将VALUE赋值给变量var；否则返回变量var的值

  ${var:+VALUE}
  
  如果变量为空或者未设置，那么不会返回任何值。否则则返回VALUE的值。注意，变量var本身的值不会被修改。

  ${var:?ERROR_INFO}
  
  如果变量var为空或者未设置，则返回错误信息ERROR_INFO；否则返回变量var的值。