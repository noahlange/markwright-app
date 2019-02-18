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

import { platform } from 'os';
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

const recursivelyFilterNullMenuItems = (
  menu: MenuItemConstructorOptions
): MenuItemConstructorOptions => {
  const submenu: any = menu.submenu
    ? Array.isArray(menu.submenu)
      ? menu.submenu.filter(i => i !== null)
      : recursivelyFilterNullMenuItems(menu)
    : undefined;
  return {
    ...menu,
    submenu
  };
};

export default class App {
  public window: BrowserWindow | null = null;
  public clients: WebContents[] = [];
  public electron: ElectronApp;
  public platform: string = platform();
  public version: string = '0.7.0';
  public basedir: string;
  public opening: string | null;
  public store = new Store();
  public recent: string[] = [];

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
    this.basedir = settings.basedir;
    this.electron = settings.app;
    this.opening = this.isPC ? process.argv[1] : settings.opening;
    this.recent = this.store.get('recent', []);
    this.initialize();
  }

  /**
   * Add a recent file to the File -> Open Recent menu.
   * @param filename
   */
  public addRecentFile(filename: string) {
    this.recent = (this.recent.includes(filename)
      ? this.recent.filter(n => n !== filename)
      : this.recent
    ).concat(filename);
    this.store.set('recent', this.recent);
    this.setMenu();
  }

  /**
   * Set (or reset) the application menu
   */
  public async setMenu() {
    Menu.setApplicationMenu(
      Menu.buildFromTemplate(
        [main, file, edit, view, window]
          .map(fn => fn(this))
          .filter(m => !!m)
          .map((m: $AnyFixMe) => recursivelyFilterNullMenuItems(m))
      )
    );
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

    this.electron.on(Events.ACTIVATE, () => {
      // On OS X it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (this.window === null) {
        this.createWindow();
      }
    });

    ipcMain.on(Events.APP_EVENT, this.handleAppEvent);

    await this.createWindow();
    await this.setMenu();
    await installExtension(REACT_DEVELOPER_TOOLS);
  }
}
