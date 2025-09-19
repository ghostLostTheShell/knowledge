"use strict";

/**
 * webpack 配置文件
 */
var fs = require('fs');

var path = require('path');

var appDirectory = fs.realpathSync(process.cwd());
var scrContext = path.join(appDirectory, "src");
var defaultIndexJs = path.join(appDirectory, "src", "index");
var appBuild = path.join(appDirectory, "build");
module.exports = {
  context: scrContext,
  mode: "development",
  //配置入口点
  //* 单个入口
  entry: defaultIndexJs,

  /*多入口配置
  key 为 Chunk的名称
  */

  /*
  entry: {
      main: './path/to/my/entry/file.js' //
      another: "another.js"
    },
  */
  output: {
    /**
     * 用于输出文件的文件名
        id 	        Chunk 的唯一标识，从0开始
        name 	    Chunk 的名称
        hash 	    Chunk 的唯一标识的 Hash 值
        chunkhash 	Chunk 内容的 Hash 值
     */
    filename: '[name].js',
    path: appBuild //输出路径

  },

  /**
   * 
   */
  publicPath: publicPath
};