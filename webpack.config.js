const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

console.log('__dirname', __dirname);
console.log('path.resolve()', path.resolve());

module.exports = {
    mode: 'production',
    entry: {
        app: path.resolve('src/index.js')
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: "[name].js"// cái này optional vì trên entry có key là tên file đầu ra rồi,
    },
    module: {
        rules: [
            {
                test: /\.s[ac]ss|css$/,
                use: ['style-loader', 'css-loader', 'sass-loader']
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Hoc Webpack App',
            filename: 'index.html',
            template: './src/template.html'
        })
    ]
}