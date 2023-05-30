
//==================== Promise  ================//

const promiseFunction = function () {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve("Hello")
        })
    })
}

const value = promiseFunction()
    .then((value) => {
        return value
    }).catch((error) => {
        return error
    }).finally(() => {
        return 'finally'
    })

promiseFunction()

const p2 = value
    .then((res) => {
        return res
    }).catch((error) => {
        return error
    }).finally(() => {
        return 'finally'
    })


/**
 * await chỉ được sử dungn trong 1 async function
 */
const handle = async () => {
    try {
        const response = await p2;
        console.log({ response });
    } catch (error) {
        console.log(error);
    } finally {
        console.log('2 finally');
    }
}
handle()

    ; (async function () {
        try {
            const response = await p2;
            console.log({ response });
        } catch (error) {
            console.log(error);
        } finally {
            console.log('2 finally');
        }
    })();