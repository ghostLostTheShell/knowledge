# Flex 布局

## 把容器设置为 Flex 布局

语法
 
  1. 
    
    display: flex;

  2. 
    
    display: inline-flex;

  3. Webkit 内核的浏览器
    
    display: -webkit-flex; /* Safari */
    display: flex;

  > 注意，设为 Flex 布局以后，子元素的float、clear和vertical-align属性将失效。


### 例子
``` css
div {
  display: flex; /** 指定为 Flex 布局 **/

}
```

## Flex 容器的属性

* flex-direction
    
  决定主轴的方向

  值
     
      row | row-reverse | column | column-reverse;

* flex-wrap
  
  容器内元素换行方式

  值 
    
    * nowrap （默认）：不换行
    
    * wrap 换行，第一行在上方。

    * wrap-reverse 换行，第一行在下方


* flex-flow
  
  是flex-direction属性和flex-wrap属性的简写形式，
  
  默认值为row nowrap。

* justify-content
  属性定义了项目在主轴上的对齐方式。

  值

    * flex-start（默认值）：左对齐

    * flex-end：右对齐

    * center： 居中

    * space-between：两端对齐，项目之间的间隔都相等。

    * space-around：每个项目两侧的间隔相等。所以，项目之间的间隔比项目与边框的间隔大一倍。

* align-items

  属性定义项目在交叉轴上如何对齐。
  
  值

  * flex-start：交叉轴的起点对齐。
  
  * flex-end：交叉轴的终点对齐。
  
  * center：交叉轴的中点对齐。
  
  * baseline: 项目的第一行文字的基线对齐。
  
  * stretch（默认值）：如果项目未设置高度或设为auto，将占满整个容器的高度。


* align-content

  align-content属性定义了多根轴线的对齐方式。如果项目只有一根轴线，该属性不起作用。

  