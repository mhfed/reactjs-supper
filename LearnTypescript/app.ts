/**
 * Basic Type
 */

//string
let car = "Toyota";
let bike: string;
bike = "Winner";
// bike = 150; loi ngay type

// number
let num: number = 10;

//boolean
let isLoading: boolean = false;

//undefined
let body = undefined;

//null
let footer: null;

//any
let person: any;
person = 10;
person = "something";
person = false;

/**
 * Object
 */

// let house = {};
// house.address = "Ha Noi" loi ngay vi chua đinh nghĩa

let house: {
  address: string;
  color?: string;
} = {
  address: "",
  color: "",
};
house.address = "Ha Noi";

/**
 * Array
 */
// function handleError() {
//   throw new Error("Loi roi");
// }

let products: any[] = [];
products.push(1);
products.push("Vietnam");

//string[]
let names = ["Mhfed", "Ben"];
let addresses: string[] = [];
addresses.push("Da nang");

//number[]
let numbers: number[] = [];
numbers = [1, 2, 3];

//object array
let people: {
  name: string;
  age: number;
}[] = [];

people.push({
  name: "Ducky",
  age: 27,
});

/**
 * Function
 */

const sum = (num1: number, num2: number) => {
  return num1 + num2;
};
sum(1, 2);

// return kieu du lieu
const sub: (num1: number, num2: number) => number = (
  num1: number,
  num2: number
) => num1 - num2;

//return void
const handle: () => void = () => {
  console.log(123);
};

/**
 * Union
 */

let price: string | number | boolean;

price = "10";
price = 20;
price = false;

let objBody: { name: string | number } | { firstName: string } = {
  firstName: "huhuhhihihi",
};

/**
 * Enum
 */

enum Sizes {
  S = "S",
  M = "M",
  L = "L",
  XL = "XL",
}
let size = Sizes.L;

/**
 * Interface
 */

interface State {
  name: string;
  isLoading: boolean;
}
interface State {
  age: number;
}

let state: State = {
  name: "Hieu",
  isLoading: false,
  age: 10,
};

/**
 * Type
 * Có thể gộp Type theo kiểu union và merge còn Interface thì không
 * Interface định nghĩa nhiều lần thì lần cuối sẽ tự merge tất cả các lần trước vào còn Type thì ko
 */

type Prop = {
  name: string;
  isLoading: boolean;
};
// type Prop = {
//   age: number
// }
type Prop2 = {
  sex: number;
};
let prop: Prop & Prop2 = {
  name: "Hieu",
  isLoading: false,
  sex: 123,
};

/**
 * Generic
 */

const handleClick = <T = string>(value: T) => value;

let value = 100;
handleClick(value);
handleClick(value);

/**
 * Class
 */

class Person {
  public name: string;
  age: number;
  private sex: boolean;
  readonly money: 400;

  constructor(name: string, age: number, sex?: boolean) {
    this.name = name;
    this.age = age;
    this.sex = sex;
  }

  handle() {
    this.sex;
    let value = this.money;
  }
}

const alex = new Person("Alex", 27);
alex.name;
alex.age;
alex.sex;
