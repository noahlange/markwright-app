// @ts-nocheck
const merge = require('webpack-merge');
const base = require('./config.base');

module.exports = merge(base, {
  entry: {
    'highlight.worker': './src/renderer/entry/highlight.ts'
  },
  output: {
    filename: 'workers/[name].js'
  },
  target: 'webworker',
  plugins: []
});
