var path = require('path');
var webpack = require('webpack');

module.exports = {
  name: 'client',
  entry: './app.js',
  output: {
    path: __dirname, filename: 'bundle.js'
  },
  module: {
    loaders: [
      { 
        test: /\.jsx?$/,         // Match both .js and .jsx files
        exclude: /node_modules/, 
        loader: "babel-loader", 
        query:
        {
          presets: ['es2015', 'react']
        }
      }
    ]
  },
  devServer: {
    historyApiFallback: true
  },
}