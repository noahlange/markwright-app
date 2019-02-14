import { ipcRenderer as ipc } from 'electron';
import { homedir } from 'os';
import Events from '@common/events';

const on = (event: string, callback: $AnyFixMe) => ipc.on(event, callback);
const once = (event: string, callback: $AnyFixMe) => ipc.once(event, callback);
const off = (events: string[]) =>
  events.forEach(event => ipc.removeAllListeners(event));

const send = (e: string, ...args: $AnyFixMe[]) =>
  ipc.send(Events.APP_EVENT, e, args);

Object.assign(window, {
  homedir,
  events: {
    on,
    once,
    off,
    send
  },
  MonacoEnvironment: {
    getWorkerUrl(_: $AnyFixMe, label: string) {
      switch (label) {
        case 'scss':
          return './scripts/css.worker.js';
        case 'json':
          return './scripts/json.worker.js';
        default:
          return './scripts/editor.worker.js';
      }
    }
  }
});