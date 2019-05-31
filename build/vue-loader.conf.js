'use strict'
const utils = require('./utils')
const config = require('../config')
const CompressionWebpackPlugin = require("compression-webpack-plugin")
const isProduction = process.env.NODE_ENV === 'production'
const sourceMapEnabled = isProduction
  ? config.build.productionSourceMap
  : config.dev.cssSourceMap

module.exports = {
  loaders: utils.cssLoaders({
    sourceMap: sourceMapEnabled,
    extract: isProduction
  }),
  cssSourceMap: sourceMapEnabled,
  cacheBusting: config.dev.cacheBusting,
  transformToRequire: {
    video: ['src', 'poster'],
    source: 'src',
    img: 'src',
    image: 'xlink:href'
  },
  css: {
    extract: true,
    sourceMap: false,
    loaderOptions: {},
    modules: false
  },
  chainWebpack: config => {
    config.module
      .rule("image")
      .use("image-webpack-loader")
      .loader("image-webpack-loader")
      .options({
        bypassOnDebug: true
      })
      .end()
  }
}
