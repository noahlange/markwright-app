import './styles/index.scss';

import { Provider } from 'react-redux';
import React from 'react';
import { render } from 'react-dom';
import { platform } from 'os';

import App from './components/app';
import store from './redux/store';

window.MonacoEnvironment = {
  getWorkerUrl(id: unknown, label: string) {
    switch (label) {
      case 'json':
        return './workers/json.worker.js';
      case 'scss':
      case 'css':
        return './workers/css.worker.js';
      case 'html':
        return './workers/html.worker.js';
      case 'typescript':
      case 'javascript':
        return './workers/ts.worker.js';
      default:
        return './workers/editor.worker.js';
    }
  }
};

(() => {
  document.body.classList.add(platform());
  render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById('react-root')
  );
})();
