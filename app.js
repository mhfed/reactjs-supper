//====================== Destructuring với Object ====================//
const user = {
  name: "Hieu",
  age: 24,
  sex: "male",
};
// const name = user.name;
// const age = user.age;
// const sex = user.sex;

// console.log(name, age, sex);

// Thay vì phải lấy từng thuộc tính như trên thì dùng Destructuring

const { name, age, sex } = user;
// console.log(name, age, sex);

//====================== Destructuring với Array ====================//

const list = [
  1,
  function (a, b) {
    return a + b;
  },
];
const [value, sum] = list;

// console.log("value", value);
// console.log("sum", sum(2, 3));

//====================== Spread Syntax ====================//
const car = {
  name: "BMW",
  color: "yellow",
  priceList: [100, 200],
};

// Shallow copy  = Copy nông
const cloneCar1 = { ...car };
const cloneCar2 = car;

// console.log(cloneCar1 === car);
// console.log(cloneCar2 === car);
// console.log(cloneCar1.priceList === car.priceList);

/**
 * ===================== Rest Parameter ===============
 */

//===== Rest of Array =====//
const listFruit = ["Orange", "Apple", "Waterlemon"];
const [fruit1, ...rest] = listFruit;
// console.log("rest", rest);
const handle = (a, b, ...c) => {
  return c;
};
const result = handle(1, 2, 3, 4, 5, 6);
console.log("result", result);

//===== Rest of Object =====//
const handle2 = ({ a, b, ...c }) => {
  return c;
};
const result2 = handle2({ a: 1, b: 2, c: 3, d: 4, e: 5 });
// console.log("result2", result2);
