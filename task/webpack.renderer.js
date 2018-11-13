const path = require('path');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { default: tsConfigPaths } = require('tsconfig-paths-webpack-plugin');

const env = process.env.NODE_ENV || 'development';

const config = {
  entry: {
    index: [
      './src/renderer/styles/index.scss',
      './src/renderer/scripts/index.tsx'
    ]
  },
  mode: env,
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'renderer.js'
  },
  target: 'electron-renderer',
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'source-map-loader',
        enforce: 'pre'
      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader'
        }
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: { sourceMap: true }
          },
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              sourceMap: true,
              plugins: [require('autoprefixer')()]
            }
          }
        ]
      },
      {
        test: /\.s[ac]ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: { sourceMap: true }
          },
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              sourceMap: true,
              plugins: [require('autoprefixer')()]
            }
          },
          {
            loader: 'sass-loader',
            options: { sourceMap: true }
          }
        ]
      },
      {
        test: /\.(png|jpg|jpeg|gif|eot|ttf|woff|woff2|svg|svgz)(\?.+)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              limit: 10000
            }
          }
        ]
      }
    ]
  },
  resolve: {
    alias: {
      '@main': path.resolve(__dirname, './src/main'),
      '@common': path.resolve(__dirname, './src/common'),
      '@renderer': path.resolve(__dirname, './src/renderer')
    },
    extensions: ['.js', '.json', '.ts', '.tsx', '.scss', '.css'],
    plugins: [
      new tsConfigPaths({})
    ]
  },
  devtool: env === 'production' ? false : 'source-map',
  plugins: [
    new MiniCssExtractPlugin({ filename: 'style.css' })
  ]
};

if (env === 'production') {
  config.plugins.push(
    new OptimizeCssAssetsPlugin({
      assetNameRegExp: /\.css$/g,
      cssProcessor: require('cssnano'),
      cssProcessorOptions: {
        discardComments: { removeAll: false }
      }
    })
  );
}

module.exports = config;
