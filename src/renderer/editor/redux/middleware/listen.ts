import { Store, Middleware } from 'redux';

import { ipcRenderer } from 'electron';
import { AppEvents } from '@common/events';
import { onLoadResponse } from '../data/actions';

/**
 * Middleware to handle events initiated by the Electron application. Redux
 * requires actions to be initiated on the client.
 */
export const listener: Middleware<Store> = store => {
  ipcRenderer.on(AppEvents.APP_LOAD, (_, res) => {
    store.dispatch(onLoadResponse(res));
  });
  return next => action => next(action);
};
