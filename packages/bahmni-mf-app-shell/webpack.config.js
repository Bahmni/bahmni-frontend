// module.exports = require('../../webpack.config');
const path = require('path');

const { merge } = require('webpack-merge');
const common = require('../../webpack.config');

module.exports = (env, argv = {}) => {
  const config = common(env, argv);
  return merge(config, {
    entry: {
      'bundle.js': [path.resolve(__dirname, 'src/microFrontendLoader.js'), path.resolve(__dirname, 'src/importmap.ts')],
    },
  });
};
