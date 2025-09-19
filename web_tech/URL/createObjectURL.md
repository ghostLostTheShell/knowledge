#
创建一个 DOMString，其中包含一个表示参数中给出的对象的URL。这个 URL 的生命周期和创建它的窗口中的 document 绑定。这个新的URL 对象表示指定的 File 对象或 Blob 对象。

objectURL = URL.createObjectURL(object);

object
用于创建 URL 的 File 对象、Blob 对象或者 MediaSource 对象。​