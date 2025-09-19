"use strict";

/**
 * unhandledRejection 事件的例子
 * 
 */
process.on('unhandledRejection', function (reason, promise) {
  //console.log('未处理的拒绝：\n', promise);
  console.log('-------------------------------------------');
  console.log('原因：\n', reason); // 记录日志、抛出错误、或其他逻辑。
}); // 触发unhandledRejection 事件

Promise.reject('错误信息:: Promise.reject'); // 触发unhandledRejection 事件

var p1 = new Promise(function (resolve, reject) {
  reject("p1错误");
});
var p2 = new Promise(function (resolve, reject) {
  reject("p2错误");
});
p2["catch"](function (err) {
  console.log("错误被处理了不会触发 unhandledRejection 事件");
});