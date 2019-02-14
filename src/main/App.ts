import {
  App as ElectronApp,
  BrowserWindow,
  ipcMain,
  WebContents,
  Menu
} from 'electron';
import installExtension, {
  REACT_DEVELOPER_TOOLS
} from 'electron-devtools-installer';

import { resolve } from 'path';
import { format } from 'url';
import { homedir } from 'os';

import { IProject } from '@common/types';
import Events from '@common/events';

import MakeProject from './events/Project';
import MakeContent from './events/Content';

import file from './menu/file';
import view from './menu/view';
import main from './menu/main';
import edit from './menu/edit';
import window from './menu/window';

type AppSettings = {
  app: ElectronApp;
  basedir: string;
};

export default class App {
  public window: BrowserWindow | null = null;
  public clients: WebContents[] = [];
  public electron: ElectronApp;
  public basedir: string = homedir();
  public version: string = '0.1.0';

  public project!: IProject;
  public events!: {
    project: MakeProject;
    content: MakeContent;
  };

  public async createWindow() {
    this.window = new BrowserWindow({
      height: 800,
      width: 1280,
      titleBarStyle: 'hidden',
      vibrancy: 'dark'
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
    await this.createWindow();

    ipcMain.on(
      Events.APP_EVENT,
      (_: Electron.Event, c: Events, args: any[]) => {
        if (c === Events.APP_CONNECTED) {
          this.clients.push(_.sender);
        }
        this.emit(c, ...args);
      }
    );

    this.events = {
      project: MakeProject.from<MakeProject>(this),
      content: MakeContent.from<MakeContent>(this)
    };
  }

  public constructor(settings: AppSettings) {
    this.electron = settings.app;
    this.initialize();
  }
}
