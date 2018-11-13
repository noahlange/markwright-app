import { App as ElectronApp, BrowserWindow } from 'electron';
import installExtension, {
  REACT_DEVELOPER_TOOLS
} from 'electron-devtools-installer';
import { resolve } from 'path';
import { format } from 'url';
import { Connection, createConnection } from 'typeorm';

import { Main, Renderer } from '../common/events';
import { SnakeNamingStrategy } from './strategy';

type AppSettings = {
  app: ElectronApp;
  basedir: string;
};

export default class App {
  public connection: Connection | null = null;
  public window: BrowserWindow | null = null;
  public electron: ElectronApp;
  public basedir: string;

  public version = '0.1.0';

  public async createWindow() {
    this.window = new BrowserWindow({ height: 800, width: 1280 });
    this.window.loadURL(
      format({
        pathname: resolve(this.basedir, './dist/index.html'),
        protocol: 'file:',
        slashes: true
      })
    );
    this.window.on(Main.WINDOW_CLOSED, () => {
      this.window = null;
    });

    this.window.webContents.on(Renderer.DID_FINISH_LOAD, () => {
      const data: any = {
        version: this.version,
        config: null,
        sites: [],
        themes: []
      };
      if (this.window) {
        this.window.webContents.send(Main.APP_DATA_LOADED, data);
        this.window.webContents.openDevTools();
      }
    });
  }

  public async createConnection() {
    this.connection = await createConnection({
      type: 'sqlite',
      logging: true,
      database: resolve(this.basedir, './dist/database.sqlite'),
      synchronize: true,
      entities: [],
      namingStrategy: new SnakeNamingStrategy()
    });
  }

  public async init() {
    await installExtension(REACT_DEVELOPER_TOOLS);
    await this.createConnection();
    await this.createWindow();
  }

  public async close() {
    if (this.connection) {
      await this.connection.close();
    }
  }

  public constructor(settings: AppSettings) {
    this.electron = settings.app;
    this.basedir = settings.basedir;
    this.init();
  }
}
