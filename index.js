
//==================== Callback function  ================//
// Là tham số - nhưng mà tham số này là function nên người ta gọi là callback function
const nums = [1, 2, 3, 4, 5];

const callback = (item, index) => {
    console.log(`STT ${index} la ${item}`);
}

nums.forEach(callback)

//==================== Currying function ================//
// Đơn giản là function return về function

function findNumber(num) {
    return function (func) {
        const result = [];
        for (let i = 0; i < num; i++) {
            if (func(i)) {
                result.push[i]
            }
        }
        return result;
    }
}

const value = findNumber(10)(num => num % 2 === 0);
console.log(value);