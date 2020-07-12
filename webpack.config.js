const webpack = require('webpack');
const path = require('path');



module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'build'),
        publicPath: '/build',
        filename: 'bundle.js'
    },
    devServer: {
        contentBase: './build'
    },
    
    mode: 'development', // TODO : mode: 'production',
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
      ],
    }
};

