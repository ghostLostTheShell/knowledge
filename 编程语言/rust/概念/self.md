# 方法中的self

  1. self，允许实现者移动和修改对象，对应的闭包特性为FnOnce
    
  2. &self，既不允许实现者移动对象也不允许修改，对应的闭包特性为Fn
    
  3. &mut self，允许实现者修改对象但不允许移动，对应的闭包特性为FnMut
    
  4. 不含self参数的关联函数称为静态方法 (static method)
