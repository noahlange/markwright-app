import Events from '@common/events';
import { ContentType, IProject } from '@common/types';
import App from '@main/App';

import { dialog } from 'electron';
import is from 'fast-deep-equal';
import { promises } from 'fs';
import { parse } from 'jsonc-parser';
import { homedir } from 'os';
import { basename, dirname, resolve } from 'path';
import { promisify } from 'util';

import EventBus from './Bus';

const empty = {
  content: {
    [ContentType.CONTENT]: '',
    [ContentType.STYLES]: '',
    [ContentType.METADATA]: '{}'
  },
  directory: homedir() + '/',
  errors: {
    [ContentType.CONTENT]: [],
    [ContentType.STYLES]: [],
    [ContentType.METADATA]: []
  },
  filename: null,
  initial: {
    [ContentType.CONTENT]: '',
    [ContentType.STYLES]: '',
    [ContentType.METADATA]: '{}'
  }
};

type Dimensions = {
  width: number;
  height: number;
};

enum PromptResult {
  CANCEL = 0,
  DISCARD = 1,
  SAVE = 2
}

export default class ApplicationEvents extends EventBus {
  public events: Events[] = [
    Events.APP_NEW,
    Events.APP_OPEN,
    Events.APP_OPEN_RECENT,
    Events.APP_SAVE,
    Events.APP_FILE,
    Events.APP_EXPORT_PDF,
    Events.WINDOW_RESIZED
  ];

  public constructor(app: App) {
    super(app);
    app.project = { ...empty };
  }

  public async [Events.WINDOW_RESIZED](dimensions: Dimensions) {
    this.app.store.set('window', dimensions);
  }

  public async [Events.APP_NEW]() {
    if (!is(this.app.project.content, this.app.project.initial)) {
      const res = await this.promptSave();
      if (res > PromptResult.CANCEL) {
        this.app.project = { ...empty };
        this.app.emit(Events.APP_LOAD, this.app.project);
      }
    }
  }

  public async [Events.APP_OPEN_RECENT](
    filename: string
  ): Promise<IProject | void> {
    const res = await this.promptSave();
    if (res > PromptResult.CANCEL) {
      await this[Events.APP_FILE](filename);
    }
  }

  public async [Events.APP_OPEN](): Promise<IProject | void> {
    const res = await this.promptSave();
    // either saved or discarded
    if (res > PromptResult.CANCEL) {
      const [filename = null] = dialog.showOpenDialog({
        filters: [
          { name: 'Markwright document', extensions: ['mw'] },
          { name: 'All Files', extensions: ['*'] }
        ]
      });
      if (filename) {
        await this[Events.APP_FILE](filename);
      }
    }
  }

  public async [Events.APP_SAVE]() {
    const { directory, filename, content } = this.app.project;
    if (filename) {
      await promises.writeFile(
        resolve(directory, filename),
        JSON.stringify({
          ...content,
          version: this.app.version
        }),
        'utf8'
      );
    } else {
      const file = dialog.showSaveDialog({
        filters: [{ name: 'Markwright', extensions: ['mw'] }]
      });
      if (file) {
        await promises.writeFile(
          file,
          JSON.stringify({
            ...content,
            version: this.app.version
          }),
          'utf8'
        );
      }
    }
  }

  public async [Events.APP_EXPORT_PDF]() {
    const wc = this.app.clients.find(c => c.getURL().endsWith('preview.html'));
    const target = dialog.showSaveDialog({
      filters: [{ name: 'PDF Document', extensions: ['pdf'] }]
    });
    if (wc && target) {
      // fn needs to be bound
      const printToPDF = promisify(wc.printToPDF).bind(wc);
      const buffer = await printToPDF({
        marginsType: 1, // no margins, leave these up to the user
        pageSize: 'Letter', // @todo configurable
        printBackground: true // always print CSS backgrounds
      });
      await promises.writeFile(target, buffer);
    }
  }

  public async [Events.APP_FILE](filename: string) {
    const file = await promises.readFile(filename, 'utf8');
    const parsed = parse(file);
    this.app.project = {
      ...empty,
      content: { ...parsed },
      directory: dirname(filename),
      filename: basename(filename),
      initial: { ...parsed }
    };
    this.app.addRecentFile(filename);
    this.app.emit(Events.APP_LOAD, this.app.project);
  }

  protected async promptSave(): Promise<PromptResult> {
    if (!is(this.app.project.content, this.app.project.initial)) {
      const res = dialog.showMessageBox({
        buttons: ['Cancel', 'Delete', 'Save'],
        detail:
          "You can choose to save your changes, or delete this document immediately. You can't undo this action.",
        message: 'Do you want to keep "Untitled.mw"?',
        type: 'warning'
      });
      switch (res) {
        case 0:
          // do nothing
          return PromptResult.CANCEL;
        case 1:
          // discard file
          return PromptResult.DISCARD;
        case 2:
          // open save
          await this[Events.APP_SAVE]();
          return PromptResult.SAVE;
      }
    }
    return PromptResult.DISCARD;
  }
}
