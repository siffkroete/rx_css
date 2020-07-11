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
    
    mode: 'development',
    module: {
      rules: [
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader'],
        },
      ],
    }
};

