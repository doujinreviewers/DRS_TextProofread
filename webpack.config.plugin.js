const path = require('path')
const webpack = require('webpack')

module.exports = {
  mode: process.env.NODE_ENV || 'development',
  entry: './src/mainwindow.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'DRS_TextProofread.js',
  },
  target: 'node',
  resolve: {
    extensions: [
      '.js',
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
        test: /\.prebundleapp/,
        type: 'asset',
        parser: {
          dataUrlCondition: (source, { filename, module }) => {
            return true;
          },
        },
        generator: {
          dataUrl: (content) => {
            return content.toString();
          },
        },
      }
    ]
  },
}