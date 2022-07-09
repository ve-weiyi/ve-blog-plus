module.exports = {
  productionSourceMap: false,
  devServer: {
    port: 8082,
    proxy: {
      "/api": {
        //wbsocket
        ws: false,
        //  目标地址
        target: "https://ve77.cn:8088",
        changeOrigin: true,
        //  重写请求地址，不携带cookie了
        pathRewrite: {
          "^/api": "/api"
        },
        logLevel: "debug" // 打印代理以后的地址
      }
    },
    disableHostCheck: true
  },
  publicPath: "/admin",
  outputDir: "admin",
  assetsDir: "static",

  chainWebpack: config => {
    config.resolve.alias.set("@", resolve("src"));
  }
};

const path = require("path");
function resolve(dir) {
  return path.join(__dirname, dir);
}
