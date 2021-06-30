/* eslint-disable no-undef */
const { override, adjustStyleLoaders, addWebpackAlias } = require('customize-cra')
const path = require('path')
module.exports = override(
  // ...其他配置...
  adjustStyleLoaders(rule => {
    if (rule.test.toString().includes('scss')) {
      rule.use.push({
        loader: require.resolve('sass-resources-loader'),
        options: {
          resources: './src/common/css/reset.scss' //这里是你自己放公共scss变量的路径
        }
      })
    }
  }),
  addWebpackAlias({
    src: path.resolve(__dirname, './src'),
    assets: path.resolve(__dirname, './src/assets'),
    components: path.resolve(__dirname, './src/components'),
    pages: path.resolve(__dirname, './src/pages'),
    common: path.resolve(__dirname, './src/common')
  })
)