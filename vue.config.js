// const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin')

module.exports = {
    publicPath: './',
    devServer: {
        proxy: {
            '/api': {
                target: 'http://127.0.0.1:10066', //对应自己的接口
                changeOrigin: true,
                ws: true,
                pathRewrite: {
                    '^/api': 'api'
                }
            },
            '/ws': {
                target: 'http://127.0.0.1:10066', //对应自己的接口
                changeOrigin: true,
                ws: true,
                pathRewrite: {
                    '^/ws': 'socket'
                }
            }
        }
    },

    configureWebpack: {
        plugins: [
            // 注意，这里的插件得是6.3.2版本的，最新的v11不支持vue-cli-service
            // new MonacoWebpackPlugin()
        ],
    },

    chainWebpack: config => {
        config
            .entry('index')
            .add('babel-polyfill')
    }
};