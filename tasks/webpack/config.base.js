const path = require('path');

const env = process.env.NODE_ENV || 'development';

module.exports = {
  mode: env,
  output: {
    path: path.resolve(__dirname, '../../public'),
    filename: 'scripts/[name].js'
  },
  stats: 'errors-only',
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
                    electron: 6
                  }
                }
              ],
              '@babel/preset-react',
              '@babel/preset-typescript'
            ],
            plugins: [
              ['@babel/plugin-proposal-decorators', { legacy: true }],
              ['@babel/plugin-proposal-class-properties'],
              '@babel/plugin-proposal-object-rest-spread',
              '@babel/plugin-proposal-optional-chaining',
              '@babel/plugin-proposal-nullish-coalescing-operator'
            ]
          }
        }
      }
    ]
  },
  resolve: {
    alias: {
      '@main': path.resolve(__dirname, '../../src/main'),
      '@common': path.resolve(__dirname, '../../src/common'),
      '@editor': path.resolve(__dirname, '../../src/renderer/editor'),
      '@preview': path.resolve(__dirname, '../../src/renderer/preview'),
      '@vendor': path.resolve(__dirname, '../../src/vendor'),
      '@utils': path.resolve(__dirname, '../../src/utils')
    },
    extensions: ['.js', '.json', '.ts', '.tsx', '.scss', '.css']
  }
};
