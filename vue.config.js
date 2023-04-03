module.exports = {
    publicPath: './',
    devServer: {
        proxy: {
            '/api': {
                target: 'http://192.168.227.120:10066', //对应自己的接口
                changeOrigin: true,
                ws: true,
                pathRewrite: {
                    '^/api': 'api'
                }
            }
        }
    },
    chainWebpack: config => {
        config
            .entry('index')
            .add('babel-polyfill')
    }
};