// @ts-nocheck
const merge = require('webpack-merge');
const base = require('./config.base');
const { resolve } = require('path');

module.exports = merge(base, {
  entry: {
    'highlight.worker': './src/renderer/workers/highlight.ts',
    'editor.worker': 'monaco-editor/esm/vs/editor/editor.worker.js',
    'json.worker': 'monaco-editor/esm/vs/language/json/json.worker',
    'css.worker': 'monaco-editor/esm/vs/language/css/css.worker',
    'html.worker': 'monaco-editor/esm/vs/language/html/html.worker'
  },
  output: {
    filename: '[name].js',
    path: resolve(__dirname, '../../public/workers')
  },
  target: 'webworker',
  plugins: []
});
