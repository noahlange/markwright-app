import Events from '@common/events';
import { Event, ipcMain } from 'electron';
import App from '../App';

export default class EventBus {
  public static from<T extends EventBus = EventBus>(app: App): T {
    const e = new this(app) as T;
    for (const channel of e.events) {
      e.handle(channel);
    }
    return e;
  }

  public app: App;
  public events: Events[] = [];

  public constructor(app: App) {
    this.app = app;
  }

  public handle(channel: Events): void {
    if (this.events.includes(channel)) {
      ipcMain.on(channel, async (_: Event, data: any) => {
        if (channel in this) {
          await (this as $AnyFixMe)[channel].bind(this)(data);
        }
      });
    }
  }
}
