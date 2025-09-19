/**
 * unhandledRejection 事件的例子
 * 
 */

process.on('unhandledRejection', (reason, promise) => {

    //console.log('未处理的拒绝：\n', promise);
    console.log('-------------------------------------------');
    console.log('原因：\n', reason);
    // 记录日志、抛出错误、或其他逻辑。
});

// 触发unhandledRejection 事件
Promise.reject('错误信息:: Promise.reject');

// 触发unhandledRejection 事件
const p1 = new Promise((resolve, reject) => {
    reject("p1错误"); 
});

const p2 = new Promise((resolve, reject) => {
    reject("p2错误"); 
});

p2.catch((err)=>{
    console.log("错误被处理了不会触发 unhandledRejection 事件");
})