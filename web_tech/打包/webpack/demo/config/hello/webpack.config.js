/**
 * webpack配置文件
 */
const path = require('path');

const paths = require("../paths")

module.exports = {
    
    /**
     * 基础目录，绝对路径，
     * 用于从配置中解析入口起点(entry point)和 loader
     */
    context = paths.context,
    entry:{
        hello: "./hello.js"
    },
    output:{
        /**
         * 此选项决定了每个输出 bundle 的名称。
         * value: string | function
         * 值为字符串时以使用以下替换模板字符串

            [hash]          模块标识符(module identifier)的 hash
            [chunkhash]     chunk 内容的 hash
            [name]          模块名称
            [id]            模块标识符(module identifier)
            [query]         模块的 query，例如，文件名 ? 后面的字符串
         > [hash] 和 [chunkhash] 的长度可以使用 [hash:16]（默认为20）来指定。或者，通过指定
         > `output.hashDigestLength` 在全局配置长度。
         */
        filename: "[name].js",
        /**
         * 输出路径
         * value: string 
         * 目录对应一个绝对路径。
         */
        path: paths.bulid
    }

 }