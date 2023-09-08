function concurrentPromises(promises, limit) {
    let results = [];
    let runningPromises = 0;
    let index = 0;

    return new Promise((resolve, reject) => {
        function runNextPromise() {
            if (index >= promises.length) {
                resolve(results);
                return;
            }

            const currentPromise = promises[index];
            index++;

            currentPromise()
                .then(result => {
                    results.push(result);
                })
                .catch(error => {
                    reject(error);
                })
                .finally(() => {
                    runningPromises--;
                    runNextPromise();
                });
        }

        while (runningPromises < limit && index < promises.length) {
            runningPromises++;
            runNextPromise();
        }
    });
}