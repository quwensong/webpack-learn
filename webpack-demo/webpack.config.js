const { resolve } = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
// const path = require("path");

/**
 * 返回运行文件所在的目录
console.log('__dirname : ' + __dirname)
// __dirname : /Desktop

// 当前命令所在的目录
console.log('resolve   : ' + resolve('./'))
// resolve   : /workspace

// 当前命令所在的目录
console.log('cwd       : ' + process.cwd())
// cwd       : /workspace
————————————————
 * 
 */

console.log(__dirname);

module.exports = {
  mode: "development",
  entry: resolve(__dirname, "./src/index.js"),
  output: {
    filename: "[name].[chunkhash:10].js",
    path: resolve(__dirname, "dist"),
  },
  // loader
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: resolve(__dirname, "loader", "doc.js"),
            options: {},
          },
        ],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: resolve(__dirname, "./public/index.html"),
    }),
  ],
};
