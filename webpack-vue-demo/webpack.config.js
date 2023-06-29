const { resolve } = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const vueLoaderPlugin = require("vue-loader/lib/plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const firstPlugin = require("./plugins/webpack-firstPlugin.js");
const EmitPlugin = require("./plugins/EmitPlugin.js");

const Webpack = require("webpack");
// 多线程打包
const HappyPack = require("happypack");
const os = require("os");
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });

// 优化压缩代码时间
const ParallelUglifyPlugin = require("webpack-parallel-uglify-plugin");

const devMode = process.argv.indexOf("--mode=production") === -1;

module.exports = {
  /**
   * output的publicPath是用来给生成的静态资源路径添加前缀的；
    devServer中的publicPath而publicPath用于指定打包后的文件在浏览器中的访问路径。；
    contentBasecontentBase用于指定服务器的根目录，即静态文件的根目录路径；但是，有时候我们需要在开发过程中访问一些静态文件，比如图片、字体文件等。这时，我们可以使用contentBase选项来指定这些静态文件的路径。
  */
  entry: {
    index: ["@babel/polyfill", resolve(__dirname, "./src/index.js")],
  },
  output: {
    path: resolve(__dirname, "dist"),
    // publicPath: "/",
    filename: "js/[name].[hash:10].js",
    chunkFilename: "js/[name].[hash:10].js",
  },
  // loader
  module: {
    rules: [
      {
        test: /\.vue$/i,
        use: [
          // {
          //   loader: resolve(__dirname, "./loaders/del-console.js"),
          // },
          {
            loader: "vue-loader",
            options: {
              compilerOptions: {
                preserveWhitespace: false,
              },
            },
          },
        ],
        include: [resolve(__dirname, "./src/")],
        exclude: /node_modules/,
      },
      {
        test: /\.js$/,
        use: [
          {
            loader: resolve(__dirname, "./loaders/del-console.js"),
          },
          {
            loader: "babel-loader",
            options: {
              // 支持vue中的jsx语法 "@vue/babel-preset-jsx"
              presets: [
                [
                  "@babel/preset-env",
                  {
                    modules: false,
                  },
                ],
                "@vue/babel-preset-jsx",
              ],
            },
          },
          {
            loader: "happyPack/loader?id=happyBabel",
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
        include: [resolve(__dirname, "./src/assets/")],
        exclude: /node_modules/,
      },

      {
        test: /\.css$/,
        use: [
          {
            // loader: devMode ? "vue-style-loader" : MiniCssExtractPlugin.loader,
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: "./dist/css/",
              // hmr: devMode,
            },
          },
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [require("autoprefixer")],
              },
            },
          },
        ],
      },
      {
        test: /\.less$/, // 针对.less结尾的文件设置LOADER
        use: [
          {
            // loader: devMode ? "vue-style-loader" : MiniCssExtractPlugin.loader,
            loader: MiniCssExtractPlugin.loader,
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
      assets: resolve(__dirname, "./src/assets"),
    },
    extensions: ["*", ".js", ".json", ".vue"],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: resolve(__dirname, "./public/index.html"),
      filename: "index.html", // 打包后的文件名  输出文件的文件名称，默认为根目录下index.html，不配置就是该文件名；此外，还可以为输出文件指定目录位置（例如'html/index.html'）
      chunks: ["index"], // 与入口文件对应的模块名
    }),
    new MiniCssExtractPlugin({
      filename: devMode ? "css/[name].css" : "css/[name].[hash:10].css",
      chunkFilename: devMode ? "css/[id].css" : "css/[id].[hash].css",
    }),
    new vueLoaderPlugin(),
    new Webpack.HotModuleReplacementPlugin(),
    new HappyPack({
      id: "happyBabel",
      // 用法和loader的配置一样，注意这里是loaders
      loaders: [
        {
          loader: "babel-loader",
          options: {
            presets: [["@babel/preset-env"]],
            cacheDirectory: true,
          },
        },
      ],
      threadPool: happyThreadPool, //共享进程池
    }),
    new Webpack.DllReferencePlugin({
      context: __dirname,
      manifest: require("./vendor-manifest.json"),
    }),
    new CopyWebpackPlugin([
      // 拷贝生成的文件从public到dist/目录 这样每次不必手动去cv
      {
        from: resolve(__dirname, "./public/static"),
        to: resolve(__dirname, "./dist/static"),
      },
    ]),
    new firstPlugin(),
    new EmitPlugin(),
  ],
  optimization: {
    minimizer: [
      // new UglifyJsPlugin({ //压缩js
      //   cache: true, // 开启缓存
      //   parallel: true, // 开启多线程
      //   sourceMap: true, // set to true if you want JS source maps
      // })
      new ParallelUglifyPlugin({
        cacheDir: ".cache/",
        uglifyJS: {
          output: {
            comments: false,
            beautify: false,
          },
          compress: {
            drop_console: true,
            collapse_vars: true,
            reduce_vars: true,
          },
        },
      }),
    ],
  },
  externals: {
    jquery: "jQuery",
  },
};
