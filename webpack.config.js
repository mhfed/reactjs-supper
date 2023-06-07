const path = require('path');

console.log('__dirname', __dirname);
console.log('path.resolve()', path.resolve());

module.exports = {
    mode: 'development',
    entry: {
        app: path.resolve('src/index.js')
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: "[name].js"// cái này optional vì trên entry có key là tên file đầu ra rồi,
    }
}