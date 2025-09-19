# 响应头

## Content-Type

作用是让服务器告诉浏览器它发送的数据属于什么文件类型。

常见参数：
application/json;charset:utf-8
text/html
multipart/form-data


## Content-Disposition

  当 Content-Type 的类型为要下载的类型时 , 这个信息头会告诉浏览器这个文件的名字和类型。
  ```
  Content-Disposition: attachment; filename="filename.jpg"
  ```