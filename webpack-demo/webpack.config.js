const { resolve } = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
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
  entry: {
    index: resolve(__dirname, "./src/index.js"),
    // main: resolve(__dirname, "./src/main.js"),
  },
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

      {
        test: /\.css$/,
        use: ["style-loader", MiniCssExtractPlugin.loader, "css-loader"],
      },
      {
        test: /\.less$/, // 针对.less结尾的文件设置LOADER
        use: [
          "style-loader",
          MiniCssExtractPlugin.loader,
          "css-loader",
          {
            loader: "postcss-loader", // 为css添加浏览器前缀
            options: {
              postcssOptions: {
                plugins: ["autoprefixer"],
              },
            },
          },
          "less-loader",
        ],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: resolve(__dirname, "./public/index.html"),
      filename: "index.html", // 打包后的文件名
      chunks: ["index"], // 与入口文件对应的模块名
    }),
    // new HtmlWebpackPlugin({
    //   template: resolve(__dirname, "./public/main.html"),
    //   filename: "main.html",
    //   chunks: ["main"], // 与入口文件对应的模块名
    // }),
    new MiniCssExtractPlugin({
      filename: "[name].[hash].css",
      chunkFilename: "[id].css",
    }),
  ],
};
