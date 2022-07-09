module.exports = {
  transpileDependencies: ["vuetify"],
  devServer: {
    port: 8081,
    proxy: {
      "/api": {
        // localhost虽然可以连接api，但是前端无法看到响应结果
        target: "https://localhost:8088",
        changeOrigin: true,
        pathRewrite: {
          "^/api": "/api"
        },
        logLevel: "debug" // 打印代理以后的地址
      }
    },
    disableHostCheck: true
  },

  // 部署后，当访问一些页面的时候，报错 Uncaught SyntaxError: Unexpected token ‘＜’。
  publicPath: "/blog",
  outputDir: "blog",
  assetsDir: "static",

  productionSourceMap: false,
  css: {
    extract: true,
    sourceMap: false
  }
};
