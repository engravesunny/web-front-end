//自定义请求函数
let urls = ['bytedance.com', 'tencent.com', 'alibaba.com', 'microsoft.com', 'apple.com', 'hulu.com', 'amazon.com'] // 请求地址
let request = url => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(`任务${url}完成`)
        }, 1000)
    }).then(res => {
        console.log('外部逻辑', res);
    })
}
// 执行任务
async function promiseControl(urls, limit) {
    let pool = []//并发池
    let max = limit //最大并发量
    for (let i in urls) {
        let url = urls[i]
        let task = request(url);
        task.then((data) => {
            //每当并发池跑完一个任务,从并发池删除个任务
            pool.splice(pool.indexOf(task), 1)
            console.log(`${url} 结束，当前并发数：${pool.length}`);
        })
        pool.push(task);
        if (pool.length === max) {
            //利用Promise.race方法来获得并发池中某任务完成的信号
            //跟await结合当有任务完成才让程序继续执行,让循环把并发池塞满
            await Promise.race(pool)
        }
    }
}

promiseControl(urls, 3);