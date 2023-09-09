const promiseControl = (promises, limit) => {
    const result = [];
    let index = 0;
    let runningPromise = 0;
    return new Promise((resolve, reject) => {
        function next() {
            if (index > promises) {
                resolve(result);
                return;
            }
            let currantPromise = promises[index];
            index++;
            currantPromise.then(res => {
                result.push(res);
            }).catch(err => {
                reject(err);
            }).finally(() => {
                runningPromise--;
                next();
            })
        }

        while (runningPromise < limit && index < promises.length) {
            runningPromise++;
            next();
        }
    })
}

async function promiseControl(urls, limit, callback) {
    let pool = new Set(); // 并发池
    for (let i in urls) {
        let url = urls[i];
        let task = request(url);
        task.then(res => {
            pool.delete(task);
            console.log(`${url}结束，当前并发数${pool.size}`);
        })
        pool.add(task);
        if (pool.size >= limit) {
            await Promise.race([...pool])
        }
    }


}

const pormisfy = (fn) => {
    return function (...args) {
        return new Promise((resolve, reject) => {
            fn(...args, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            })
        })
    }
}



