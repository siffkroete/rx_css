const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');



module.exports = {
  entry: './src/index.js',
  output: {
      path: path.resolve(__dirname, 'build'),
      publicPath: '/build',
      filename: '[name].bundle.js',
  },
  // Der devServer wird in der Datei webpack.dev.js geladen, so sollte es zumindest klappen
  // devServer: {
  //     contentBase: './build'
  // },
    
  plugins: [
    new HtmlWebpackPlugin({
      title: "Pong with canvas",
      template: "./src/html/pong_canvas.html",
      filename: "pong_canvas.html",
      inject: 'head',
      chunks: ['pong_canvas']
    }),

    new HtmlWebpackPlugin({
      title: "Pong with css",
      template: "./src/html/pong_css.html",
      filename: "pong_css.html",
      inject: 'head',
      chunks: ['pong_css']
    })
  ],

  module: {
    rules: [
      {
        test: /\.css$/i,
        exclude: /node_modules/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.js$/,
        enforce: 'pre',
        use: ['source-map-loader'],
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  }
};

