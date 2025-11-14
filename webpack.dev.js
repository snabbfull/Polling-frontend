// eslint-disable-next-line no-unused-vars
const path = require('path');
// eslint-disable-next-line import/no-extraneous-dependencies
const webpack = require('webpack');
// eslint-disable-next-line import/no-extraneous-dependencies
const { merge } = require('webpack-merge');
const common = require('./webpack.common');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    historyApiFallback: true,
    open: true,
    compress: true,
    port: 8080,
  },

  // eslint-disable-next-line prettier/prettier
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ],
});
