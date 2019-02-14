const path = require('path');

module.exports = [
  require('./webpack/config.main.js'),
  require('./webpack/config.renderer.js'),
  require('./webpack/config.worker.js')
];
