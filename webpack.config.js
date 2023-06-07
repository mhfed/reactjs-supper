const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
console.log("__dirname", __dirname);
console.log("path.resolve()", path.resolve());

module.exports = (env) => {
  const isDevelopment = Boolean(env.development);
  return {
    mode: isDevelopment ? "development" : "production",
    entry: {
      app: path.resolve("src/index.js"),
    },
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "[name].[contenthash].js", // cái này optional vì trên entry có key là tên file đầu ra rồi,
      clean: true,
    },
    devtool: isDevelopment ? "source-map" : false,
    module: {
      rules: [
        {
          test: /\.s[ac]ss|css$/,
          use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
        },
      ],
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: "[name].[contenthash].css",
      }),
      new HtmlWebpackPlugin({
        title: "Hoc Webpack App",
        filename: "index.html",
        template: "./src/template.html",
      }),
    ],
    devServer: {
      static: {
        directory: "dist", // Đường dẫn tương đối đến thư mục chứa file html
      },
      port: 3000, // Port thay cho port mặc định 8080
      open: true, // Mở trang webpack khi chạy terminal
      hot: true, // Bật tính năng reload nhanh Hot Module Replacement
      compress: true, // Bật Gzip cho các tài nguyên
      historyApiFallback: true, // Set true nếu đang dùng cho các SPA sử dụng history router
    },
  };
};
