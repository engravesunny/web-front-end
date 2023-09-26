async function promiseControl(
  urls: string[],
  limit: number,
  request: (url: string) => Promise<any>
) {
  let pool = new Set();
  for (let i in urls) {
    let url = urls[i];
    let task = request(url);
    task.then((res) => {
      pool.delete(task);
    });
    pool.add(task);
    if (pool.size === limit) {
      await Promise.race(pool);
    }
  }
}
