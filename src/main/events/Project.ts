import EventBus from './Bus';
import { parse } from 'jsonc-parser';

import Events from '@common/events';
import { IProject, ContentType } from '@common/types';
import { promises } from 'fs';
import { dirname, basename, resolve } from 'path';
import { homedir } from 'os';
import { dialog } from 'electron';
import App from '@main/App';

const empty = {
  errors: {
    [ContentType.CONTENT]: [],
    [ContentType.STYLES]: [],
    [ContentType.METADATA]: []
  },
  content: {
    [ContentType.CONTENT]: '',
    [ContentType.STYLES]: '',
    [ContentType.METADATA]: '{}'
  },
  directory: homedir() + '/',
  filename: null
};

export default class ProjectEvents extends EventBus {
  public events: Events[] = [
    Events.APP_OPEN,
    Events.APP_SAVE,
    Events.APP_EXPORT_PDF
  ];

  public constructor(app: App) {
    super(app);
    app.project = { ...empty };
  }

  public async [Events.APP_OPEN](): Promise<IProject | void> {
    const choices = dialog.showOpenDialog({
      filters: [
        { name: 'Markwright', extensions: ['mw'] },
        { name: 'All Files', extensions: ['*'] }
      ]
    });
    const filename = choices && choices.shift();
    if (filename) {
      const file = await promises.readFile(filename, 'utf8');
      this.app.project = {
        ...empty,
        directory: dirname(filename),
        filename: basename(filename),
        content: parse(file)
      };
      this.app.emit(Events.APP_LOAD, this.app.project);
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
      filters: [{ name: 'PDF', extensions: ['pdf'] }]
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
}