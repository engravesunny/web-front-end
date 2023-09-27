const promiseControls = async (
  promises: Array<Promise<any>>,
  limit: number,
  callback: Function
) => {
  if (!Array.isArray(promises)) {
    throw new TypeError(`promises must be a array, but got ${promises} `);
  }

  let pool = new Set();
  let result: any[] = [];
  for (let promise of promises) {
    let task = promise;
    task
      .then((res: any) => {
        pool.delete(task);
        console.log(
          "%c [ res ]-16",
          "font-size:13px; background:pink; color:#bf2c9f;",
          res,
          "当前并发池数量：",
          pool.size
        );
        result.push({
          status: "fulfilled",
          value: res,
        });
      })
      .catch((reason) => {
        pool.delete(task);
        console.log(
          "%c [ reason ]-27",
          "font-size:13px; background:pink; color:#bf2c9f;",
          reason,
          "当前并发池数量：",
          pool.size
        );
        result.push({
          status: "rejected",
          value: reason,
        });
      });
    pool.add(task);
    if (pool.size >= limit) {
      console.log("等待完成");
      await Promise.race([...pool]);
    }
  }
  await Promise.allSettled([...pool]);
  callback(result);
};

let p1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    // reject("keqing1")
    resolve("keqing1");
  }, 1000);
});
let p2 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("keqing2");
    // reject("keqing2")
  }, 1000);
});
let p3 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("keqing3");
    // reject("keqing3")
  }, 1000);
});
let p4 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("keqing4");
    // reject("keqing4")
  }, 1000);
});
let p5 = new Promise((resolve, reject) => {
  setTimeout(() => {
    reject("keqing5");
    // reject("keqing5")
  }, 1000);
});
let p6 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("keqing6");
    // reject("keqing6")
  }, 1000);
});

const promises = [p2, p3, p4, p1, p6, p5];

promiseControls(promises, 1, () => {});
