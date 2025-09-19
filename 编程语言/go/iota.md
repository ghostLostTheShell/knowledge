# iota

iota是golang语言的常量计数器,只能在常量的表达式中使用。iota在const关键字出现时将被重置为0(const内部的第一行之前)，const中每新增一行常量声明将使iota计数一次(iota可理解为const语句块中的行索引)。常用于定义枚举

1. 
```go 
const ( 
  a = iota      //a=0 
  b             //b=1   相当于c=iota
  c             //c=2    相当于c=iota
)
```

2. 跳过的值

```go 
const ( 

  a = iota     //a=0 
  b            //b=1   
  c            //c=2   
  -
  -
  e            //e=5   
)

3. 位掩码表达式

```go
type Allergen int

const ( 
    IgEggs Allergen = 1 << iota         // 1 << 0 which is 00000001 
    IgChocolate                         // 1 << 1 which is 00000010 
    IgNuts                              // 1 << 2 which is 00000100 
    IgStrawberries                      // 1 << 3 which is 00001000 
    IgShellfish                         // 1 << 4 which is 00010000 
)
```

4. 定义数量级

```go
type ByteSize float64

const (
    _           = iota                   // ignore first value by assigning to blank identifier
    KB ByteSize = 1 << (10 * iota) // 1 << (10*1)
    MB                                   // 1 << (10*2)
    GB                                   // 1 << (10*3)
    TB                                   // 1 << (10*4)
    PB                                   // 1 << (10*5)
    EB                                   // 1 << (10*6)
    ZB                                   // 1 << (10*7)
    YB                                   // 1 << (10*8)
)
```

5. 





