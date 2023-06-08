import getText from "./ultil";
import "./styles/style.css"
import "./styles/style.scss"

console.log(getText());

const getData = () => {
    return new Promise((resolve, reject) => {
        resolve("123")
    })
}
getData().then((res))=> {
    console.log("res", res);
}