import Events from '@common/events';
import { ipcRenderer as ipc } from 'electron';
import { homedir, platform } from 'os';

const on = (event: string, callback: $AnyFixMe) => ipc.on(event, callback);
const once = (event: string, callback: $AnyFixMe) => ipc.once(event, callback);
const off = (events: string[]) =>
  events.forEach(event => ipc.removeAllListeners(event));

const send = (e: string, ...args: $AnyFixMe[]) =>
  ipc.send(Events.APP_EVENT, e, args);

Object.assign(window, {
  events: {
    off,
    on,
    once,
    send
  },
  homedir,
  platform
});
