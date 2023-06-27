const { resolve } = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const vueLoaderPlugin = require("vue-loader/lib/plugin");
const Webpack = require("webpack");

const devMode = process.argv.indexOf("--mode=production") === -1;

module.exports = {
  mode: "development",
  /**
   * output的publicPath是用来给生成的静态资源路径添加前缀的；
    devServer中的publicPath是用来本地服务拦截带publicPath开头的请求的；
    contentBase是用来指定被访问html页面所在目录的；
  */
  devServer: {
    port: 8081,
    hot: true,
    contentBase: "./dist",
  },
  entry: {
    index: ["@babel/polyfill", resolve(__dirname, "./src/index.js")],
  },
  output: {
    path: resolve(__dirname, "dist"),
    filename: "js/[name].[hash:10].js",
    chunkFilename: "js/[name].[hash:10].js",
  },
  // loader
  module: {
    rules: [
      {
        test: /\.vue$/i,
        use: [
          {
            loader: "vue-loader",
            options: {
              compilerOptions: {
                preserveWhitespace: false,
              },
            },
          },
        ],
      },
      {
        test: /\.js$/,
        use: [
          {
            loader: "babel-loader",
            options: {
              // 支持vue中的jsx语法 "@vue/babel-preset-jsx"
              presets: ["@babel/preset-env", "@vue/babel-preset-jsx"],
            },
          },
        ],
        exclude: /node_modules/,
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
        test: /\.css$/,
        use: [
          {
            loader: devMode ? "vue-style-loader" : MiniCssExtractPlugin.loader,
            options: {
              publicPath: "./dist/css/",
              // hmr: devMode,
            },
          },
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              postcssOptions:{
                plugins: [require("autoprefixer")],
              }
            },
          },
        ],
      },
      {
        test: /\.less$/, // 针对.less结尾的文件设置LOADER
        use: [
          {
            loader: devMode ? "vue-style-loader" : MiniCssExtractPlugin.loader,
            options: {
              publicPath: "./dist/css/",
              // hmr: devMode,
            },
          },
          "css-loader",
          "less-loader",
          {
            loader: "postcss-loader", // 为css添加浏览器前缀
            options: {
              postcssOptions: {
                plugins: ["autoprefixer"],
              },
            },
          },
        ],
      },
    ],
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
    extensions: ["*", ".js", ".json", ".vue"],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: resolve(__dirname, "./public/index.html"),
      filename: "index.html", // 打包后的文件名
      chunks: ["index"], // 与入口文件对应的模块名
    }),
    new MiniCssExtractPlugin({
      filename: devMode ? "css/[name].css" : "css/[name].[hash:10].css",
      chunkFilename: devMode ? "css/[id].css" : "css/[id].[hash].css",
    }),
    new vueLoaderPlugin(),
    new Webpack.HotModuleReplacementPlugin(),
  ],
};
