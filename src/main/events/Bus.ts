import { Event, ipcMain } from 'electron';
import { Common } from '../../common/events';
import App from '../App';

export default class EventBus {
  public static from(app: App) {
    const e = new this(app);
    for (const channel of e.events) {
      e.handle(channel);
    }
    return e;
  }

  public app: App;
  public events: Common[] = [];

  public handle(channel: Common): void {
    if (channel in this) {
      ipcMain.on(channel, async (event: Event, data: any) => {
        const fn = (this as any)[channel].bind(this);
        const res = await fn(data);
        event.sender.send(channel, res);
      });
    }
  }

  public constructor(app: App) {
    this.app = app;
  }
}
