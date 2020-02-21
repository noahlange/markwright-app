import { DataState } from './data/state';
import { UIState } from './ui/state';

import data from './data/reducer';
import ui from './ui/reducer';

import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import promise from 'redux-promise';
import { listener } from './middleware/listen';

interface Window {
  __REDUX_DEVTOOLS_EXTENSION__: Function;
}

declare const window: Window;

export interface AppState {
  data: DataState;
  ui: UIState;
}

const reducer = combineReducers({ ui, data });

export default createStore(
  reducer,
  compose(
    applyMiddleware(promise, listener),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  )
);
