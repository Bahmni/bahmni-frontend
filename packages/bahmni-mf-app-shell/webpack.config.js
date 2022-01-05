const path = require('path')

const {merge} = require('webpack-merge')
const commonWebpack = require('../../webpack.config')
const WebpackConcatPlugin = require('webpack-concat-files-plugin')

module.exports = (env, argv = {}) => {
  let commonConfig = commonWebpack(env, argv)
  const dist = `${commonConfig.output.path}/${commonConfig.output.filename}`
  commonConfig.output = {}
  return merge(commonConfig, {
    plugins: [
      new WebpackConcatPlugin({
        bundles: [
          {
            dest: dist,
            src: ['./src/importmap.js', './src/microFrontendLoader.js'],
          },
        ],
      }),
    ],
  })
}
