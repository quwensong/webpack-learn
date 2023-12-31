// 开发环境主要实现的是热更新,不要压缩代码，完整的sourceMap
const Webpack = require("webpack");
const webpackConfig = require("./webpack.config.js");
const WebpackMerge = require("webpack-merge");

module.exports = WebpackMerge.merge(webpackConfig, {
  mode: "development",
  devtool: "cheap-module-eval-source-map",
  devServer: {
    port: 8080,
    hot: true,
    contentBase: "./public",
    // publicPath: "/html",  //需要这样子访问 http://localhost:8080/html
    // publicPath: "/",  //需要这样子访问 http://localhost:8080
  },
});
