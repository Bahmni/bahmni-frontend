const path = require('path');
const webpack = require('webpack');

module.exports = {
  mode: 'development',
  entry: './index.tsx',
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: 'main.js',
  },
  target: 'node',
  devServer: {
    port: '8000',
    // contentBase: ['./public'],
    static: ['./public'],
    open: true,
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.REACT_APP_USERNAME': JSON.stringify(process.env.REACT_APP_USERNAME),
      'process.env.REACT_APP_PASSWORD': JSON.stringify(process.env.REACT_APP_PASSWORD),
    }),
  ],
};
