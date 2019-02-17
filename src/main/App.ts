import {
  App as ElectronApp,
  BrowserWindow,
  ipcMain,
  Menu,
  MenuItemConstructorOptions,
  WebContents
} from 'electron';
import installExtension, {
  REACT_DEVELOPER_TOOLS
} from 'electron-devtools-installer';

import { autobind } from 'core-decorators';
import Store from 'electron-store';

import { homedir, platform } from 'os';
import { resolve } from 'path';
import { format } from 'url';

import Events from '@common/events';
import { IProject } from '@common/types';

import EventsApplication from './events/Application';
import EventsContent from './events/Content';

import edit from './menu/edit';
import file from './menu/file';
import main from './menu/main';
import view from './menu/view';
import window from './menu/window';

type AppSettings = {
  app: ElectronApp;
  basedir: string;
  opening: string | null;
};

enum Clients {
  NONE,
  ONE,
  BOTH
}

export default class App {
  public window: BrowserWindow | null = null;
  public clients: WebContents[] = [];
  public electron: ElectronApp;
  public basedir: string = homedir();
  public platform: string = platform();
  public version: string = '0.1.0';

  public opening: string | null;

  public store = new Store();

  public project!: IProject;
  public events!: {
    application: EventsApplication;
    content: EventsContent;
  };

  public get isMac() {
    return this.platform === 'darwin';
  }

  public get isPC() {
    return this.platform === 'win32';
  }

  public constructor(settings: AppSettings) {
    this.electron = settings.app;
    this.opening = this.isPC ? process.argv[1] : settings.opening;
    this.initialize();
  }

  public async createWindow() {
    this.window = new BrowserWindow({
      backgroundColor: this.isPC ? '#191919' : undefined,
      height: this.store.get('window.height', 800),
      titleBarStyle: 'hidden',
      vibrancy: 'dark',
      width: this.store.get('window.width', 1280)
    });

    this.window.loadURL(
      format({
        pathname: resolve(__dirname, '../index.html'),
        protocol: 'file:',
        slashes: true
      })
    );

    this.window.on(Events.WINDOW_CLOSED, () => {
      this.window = null;
    });
  }

  public async emit(channel: Events, ...data: any[]) {
    ipcMain.emit(channel, null, ...data);
    for (const client of this.clients) {
      try {
        await client.send(channel, ...data);
      } catch (e) {
        // likely that the client has been destroyed
        this.clients.splice(this.clients.indexOf(client), 1);
      }
    }
  }

  @autobind
  public async handleAppEvent(
    _: Electron.Event,
    c: Events,
    args: Array<unknown>
  ) {
    if (c === Events.APP_CONNECTED) {
      this.clients.push(_.sender);
    }
    if (this.clients.length === Clients.BOTH) {
      if (this.opening) {
        this.emit(Events.APP_FILE, this.opening);
        this.opening = null;
      }
    }
    await this.emit(c, ...args);
  }

  public setMenu() {
    Menu.setApplicationMenu(
      Menu.buildFromTemplate([
        main(this),
        file(this),
        edit(this),
        view(this),
        window(this)
      ].filter(m => !!m) as MenuItemConstructorOptions[])
    );
  }

  public async initialize() {
    this.events = {
      application: EventsApplication.from<EventsApplication>(this),
      content: EventsContent.from<EventsContent>(this)
    };

    this.electron.on(Events.WINDOW_ALL_CLOSED, async () => {
      // On OS X it is common for applications and their menu bar
      // to stay active until the user quits explicitly with Cmd + Q
      if (this.isPC) {
        this.electron.quit();
      }
    });

    this.electron.on(Events.APP_ACTIVATE, () => {
      // On OS X it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (this.window === null) {
        this.createWindow();
      }
    });

    ipcMain.on(Events.APP_EVENT, this.handleAppEvent);

    await this.createWindow();
    this.setMenu();
    await installExtension(REACT_DEVELOPER_TOOLS);
  }
}
