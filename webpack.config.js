const path = require('path')
const webpack = require('webpack')
const { VueLoaderPlugin } = require('vue-loader')
const TerserPlugin = require("terser-webpack-plugin")

module.exports = {
  mode: process.env.NODE_ENV || 'development',
  entry: './src/app/index.js',
  output: {
    path: path.resolve(__dirname, 'src/plugin/assets'),
    filename: 'DRS_TextProofread.prebundleapp',
    publicPath: '',
  },
  resolve: {
    extensions: [
      '.js',
      '.vue',
      '.json',
    ],
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.css$/,
        use: ["vue-style-loader", "css-loader"]
      },
      {
        test: /\.vue$/,
        loader: "vue-loader"
      },
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new webpack.DefinePlugin({
      __VUE_OPTIONS_API__: true,
      __VUE_PROD_DEVTOOLS__: false
    })
  ],
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        test: /\.js(\?.*)?$|\.prebundleapp/i,
      }),
    ],
  },
}