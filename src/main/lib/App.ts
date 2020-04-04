import { App as ElectronApp, BrowserWindow, ipcMain, Menu } from 'electron';

import Store from 'electron-store';

import { platform } from 'os';
import { join, resolve } from 'path';
import { format } from 'url';

import Events, { AppEvents } from '@common/events';
import Project from '@main/lib/Project';

import EventsApplication from '../events/Application';

import ApplicationMenu from '../menu/ApplicationMenu';

interface AppSettings {
  app: ElectronApp;
  basedir: string;
  opening: string | null;
}

export default class App {
  public window!: BrowserWindow | null;
  public electron: ElectronApp;
  public platform: string = platform();
  public version = '0.7.0';
  public basedir: string;
  public opening: string | null;
  public store = new Store();
  public recent: string[] = [];

  protected _project!: Project;

  public events: EventsApplication = new EventsApplication(this);

  public get project(): Project {
    return this._project;
  }

  public set project(p: Project) {
    this._project = p;
    this._project.app = this;
  }

  public get isMac(): boolean {
    return this.platform === 'darwin';
  }

  public get isPC(): boolean {
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
   * Set (or reset) the application menu
   */
  public async setMenu(): Promise<void> {
    Menu.setApplicationMenu(
      Menu.buildFromTemplate(ApplicationMenu.map(M => new M(this)))
    );
  }

  public async createWindow(): Promise<void> {
    this.window = new BrowserWindow({
      backgroundColor: this.isPC ? '#191919' : undefined,
      height: this.store.get('window.height', 800),
      titleBarStyle: 'hidden',
      vibrancy: 'dark',
      webPreferences: { nodeIntegration: true },
      width: this.store.get('window.width', 1280)
    });

    this.window.loadURL(
      format({
        pathname: join(resolve(__dirname, '..'), './index.html'),
        protocol: 'file:',
        slashes: true
      })
    );

    this.window.on(Events.WINDOW_CLOSED, async () => {
      this.window = null;
    });
  }

  public async initialize(): Promise<void> {
    this.project = await Project.from();

    ipcMain.on(Events.APP_EVENT, this.events.handleEvent);

    this.electron.on(Events.WINDOW_ALL_CLOSED, async () => {
      // On OS X it is common for applications and their menu bar
      // to stay active until the user quits explicitly with Cmd + Q
      if (this.isPC) {
        this.electron.quit();
      }
    });

    this.electron.on(Events.WINDOW_QUIT, async () => {
      const quit = await this.events[AppEvents.APP_CLOSE]();
      return quit;
    });

    this.electron.on(Events.ACTIVATE, async () => {
      // On OS X it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (this.window === null) {
        await this.createWindow();
      }
    });

    await this.setMenu();
    await this.createWindow();
  }
}
