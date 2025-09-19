#

## 属性

### flex : 弹性布局
  将对象作为弹性伸缩盒显示

*  -webkit-flex
  
    在webkit内核的浏览器上使用要加前缀

* flex

* inline-flex

    将对象作为内联块级弹性伸缩盒显示
    >flex || inline-flex; 兼容性写法


Flexible Box: 

---


## inline , block 与 inline-block的区别

* inline :

  - 使元素变成行内元素，拥有行内元素的特性. 
  
  - 不能更改元素的height，width的值，大小由内容撑开. 
  margin只有left和right产生边距效果，但是top和bottom就不行.

* block:

  - 使元素变成块级元素，独占一行，在不设置自己的宽度的情况下，块级元素会默认填满父级元素的宽度. 
  
  - 能够改变元素的height，width的值. 
        
  - 可以设置padding，margin的各个属性值，top，left，bottom，right都能够产生边距效果.

* inline-block:
  结合了inline与block的一些特点, 通俗来讲讲，就是不独占一行的块级元素

  - 使元素变成行内元素，拥有行内元素的特性，即可以与其他行内元素共享一行，不会独占一行. 

  - 能够改变元素的height，width的值. 

  - 可以设置padding，margin的各个属性值，top，left，bottom，right都能够产生边距效果


|*|inline| block| inline-block|
|---|---| --- |---|

