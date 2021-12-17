const WebpackConcatPlugin = require('webpack-concat-files-plugin');

const config = {
  entry: './src/microFrontendLoader.js',
  plugins: [
    new WebpackConcatPlugin({
      bundles: [
        {
          dest: '../../dist/mf-app-shell/main.js',
          src: ['./src/importmap.js', './src/microFrontendLoader.js'],
        },
      ],
    }),
  ],
};

module.exports = () => {
  return config;
};
