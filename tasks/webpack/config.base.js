const path = require('path');

const env = process.env.NODE_ENV || 'development';

module.exports = {
  mode: env,
  output: {
    path: path.resolve(__dirname, '../../public'),
    filename: 'scripts/[name].js'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                '@babel/preset-env',
                {
                  targets: {
                    electron: '4'
                  }
                }
              ],
              '@babel/preset-react',
              '@babel/preset-typescript'
            ],
            plugins: [
              ['@babel/plugin-proposal-decorators', { legacy: true }],
              ['@babel/plugin-proposal-class-properties', { loose: true }],
              '@babel/plugin-proposal-object-rest-spread'
            ]
          }
        }
      }
    ]
  },
  resolve: {
    alias: {
      '@main': path.resolve(__dirname, '../../src/main/'),
      '@common': path.resolve(__dirname, '../../src/common/'),
      '@renderer': path.resolve(__dirname, '../../src/renderer/')
    },
    extensions: ['.js', '.json', '.ts', '.tsx', '.scss', '.css']
  }
};
