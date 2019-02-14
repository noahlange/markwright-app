import '../styles/index.scss';
import './preload';

import React from 'react';
import { render } from 'react-dom';
import App from '../components/app';

render(<App />, document.getElementById('react-root'));
