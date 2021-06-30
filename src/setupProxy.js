const proxy = require("http-proxy-middleware");
// const apiService = 'http://192.168.5.101:8400'
// const apiService = 'https://proapi.yiyun-smart.com'
// const apiService = 'https://api-fcsp.zgyiyun.com:1200'
module.exports = (app) => {
  app.use(
    "/api",
    proxy({
      // target: "http://192.168.5.248:10000",
      target: 'http://192.168.5.233:8888',
      changeOrigin: true,
      pathRewrite: {
        "^/api": "/",
      },
    })
  );
  app.use(
    "/test",
    proxy({
        target: 'http://192.168.5.233:8888',
        // target: "http://192.168.5.248:10000",
        changeOrigin: true,
      pathRewrite: {
        "^/test": "/",
      },
    })
  );
};
