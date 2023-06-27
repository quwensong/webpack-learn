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
        test: /\.(jpe?g|png|gif)$/i, //图片文件
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 25 * 1024, //25 kb以下的图片会被转换成base64
              fallback: {
                loader: "file-loader",
                options: {
                  name: "image/[name].[hash:8].[ext]",
                },
              },
            },
          },
        ],
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/, //媒体文件
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 10 * 1024,
              fallback: {
                loader: "file-loader",
                options: {
                  name: "media/[name].[hash:8].[ext]",
                },
              },
            },
          },
        ],
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i, // 字体
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 10 * 1024,
              fallback: {
                loader: "file-loader",
                options: {
                  name: "fonts/[name].[hash:8].[ext]",
                },
              },
            },
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
      filename: "[name].[hash:10].css",
      chunkFilename: "[id].css",
    }),
  ],
};
