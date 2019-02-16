import { parse } from 'jsonc-parser';
import EventBus from './Bus';

import Events from '@common/events';
import { ContentType, IProject } from '@common/types';
import App from '@main/App';
import { dialog } from 'electron';
import { promises } from 'fs';
import { homedir } from 'os';
import { basename, dirname, resolve } from 'path';
import { promisify } from 'util';

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
  filename: null
};

export default class ProjectEvents extends EventBus {
  public events: Events[] = [
    Events.APP_OPEN,
    Events.APP_SAVE,
    Events.APP_FILE,
    Events.APP_EXPORT_PDF
  ];

  public constructor(app: App) {
    super(app);
    app.project = { ...empty };
  }

  public async [Events.APP_OPEN](): Promise<IProject | void> {
    const choices = dialog.showOpenDialog({
      filters: [
        { name: 'Markwright document', extensions: ['mw'] },
        { name: 'All Files', extensions: ['*'] }
      ]
    });
    const filename = choices && choices.shift();
    if (filename) {
      await this[Events.APP_FILE](filename);
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
        marginsType: 1, // no margins, leaves these up to the user
        pageSize: 'Letter', // @todo
        printBackground: true // always print CSS backgrounds
      });
      await promises.writeFile(target, buffer);
    }
  }

  public async [Events.APP_FILE](filename: string) {
    const file = await promises.readFile(filename, 'utf8');
    this.app.project = {
      ...empty,
      content: parse(file),
      directory: dirname(filename),
      filename: basename(filename)
    };
    this.app.emit(Events.APP_LOAD, this.app.project);
  }
}
