import {
  App as ElectronApp,
  BrowserWindow,
  ipcMain,
  Menu,
  WebContents
} from 'electron';
import installExtension, {
  REACT_DEVELOPER_TOOLS
} from 'electron-devtools-installer';

import { homedir, platform } from 'os';
import { resolve } from 'path';
import { format } from 'url';

import Events from '@common/events';
import { IProject } from '@common/types';

import MakeContent from './events/Content';
import MakeProject from './events/Project';

import edit from './menu/edit';
import file from './menu/file';
import main from './menu/main';
import view from './menu/view';
import window from './menu/window';

type AppSettings = {
  app: ElectronApp;
  basedir: string;
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
  public version: string = '0.1.0';
  public opening: string | null = null;

  public project!: IProject;
  public events!: {
    project: MakeProject;
    content: MakeContent;
  };

  public constructor(settings: AppSettings) {
    this.electron = settings.app;
    this.initialize();
  }

  public async createWindow() {
    this.window = new BrowserWindow({
      backgroundColor: platform() === 'darwin' ? undefined : '#191919',
      height: 900,
      titleBarStyle: 'hidden',
      vibrancy: 'dark',
      width: 1600
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

  public async initialize() {
    Menu.setApplicationMenu(
      Menu.buildFromTemplate([
        main(this),
        file(this),
        edit(this),
        view(this),
        window(this)
      ])
    );

    await installExtension(REACT_DEVELOPER_TOOLS);

    ipcMain.on(
      Events.APP_EVENT,
      async (_: Electron.Event, c: Events, args: Array<unknown>) => {
        if (c === Events.APP_CONNECTED) {
          this.clients.push(_.sender);
        }
        // need to wait for editor and preview pane
        if (this.opening && this.clients.length === Clients.BOTH) {
          await this.emit(Events.APP_FILE, this.opening);
          this.opening = null;
        }
        await this.emit(c, ...args);
      }
    );

    this.events = {
      content: MakeContent.from<MakeContent>(this),
      project: MakeProject.from<MakeProject>(this)
    };

    this.electron.on(Events.OPEN_FILE, async (e, path) => {
      // wait for clients to connect
      e.preventDefault();
      if (this.window === null) {
        this.opening = path;
        await this.createWindow();
      }
    });

    this.electron.on(Events.WINDOW_ALL_CLOSED, async () => {
      // On OS X it is common for applications and their menu bar
      // to stay active until the user quits explicitly with Cmd + Q
      if (process.platform !== 'darwin') {
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

    await this.createWindow();
  }
}
