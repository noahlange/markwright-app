import { ipcMain } from 'electron';

import Events, { AppEvents } from '@common/events';
import App from '@main/lib/App';
import { autobind } from 'core-decorators';

interface EventData {
  event: AppEvents;
  payload?: $AnyFixMe;
}

export default class EventBus {
  public app: App;
  public events: AppEvents[] = [];

  public constructor(app: App) {
    this.app = app;
  }

  @autobind
  public async handleEvent(_: Electron.Event, data: EventData): Promise<void> {
    if (!this.app.opening) {
      this.emit(AppEvents.APP_FILE, {
        opening: this.app.opening
      });
      this.app.opening = null;
    }
    const channel = data.event;
    if (channel in this) {
      const res = await (this as $AnyFixMe)[channel].call(this, data.payload);
      this.send(channel, res);
    }
  }

  @autobind
  public send(channel: AppEvents, data: $AnyFixMe = {}): void {
    if (this.app.window) {
      this.app.window.webContents.send(channel, data);
    }
  }

  @autobind
  public emit(event: AppEvents, data: $AnyFixMe = {}): void {
    console.info({event});
    ipcMain.emit(Events.APP_EVENT, null, { event, ...data });
  }
}
