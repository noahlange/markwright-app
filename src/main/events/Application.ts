import Events, { AppEvents } from '@common/events';
import _, { T } from '@common/l10n';
import Project, { SerializedProject, ProjectInfo } from '@main/lib/Project';

import { promises } from 'fs';

import EventBus from './Bus';
import { open, save, warn } from '@main/util/dialog';
import { ContentType, ProcessResult } from '@common/types';

enum Results {
  SUCCESS,
  FAILURE,
  CANCEL
}

interface Dimensions {
  width: number;
  height: number;
}

export enum PromptResult {
  CANCEL = 0,
  DISCARD = 1,
  SAVE = 2
}

export default class ApplicationEvents extends EventBus {
  public async [Events.WINDOW_RESIZED](dimensions: Dimensions): Promise<void> {
    this.app.store.set('window', dimensions);
  }

  public async [AppEvents.APP_CONTENT_PROCESS]<T extends ContentType>(req: {
    type: T;
    value: string;
  }): Promise<ProcessResult<T>> {
    const { type, value } = req;
    return this.app.project.update(type, value);
  }

  public async [AppEvents.APP_CLOSE](): Promise<boolean> {
    switch (await this.close()) {
      case Results.SUCCESS:
        return true;
      case Results.FAILURE:
      case Results.CANCEL:
        return false;
    }
  }

  public async [AppEvents.APP_NEW](): Promise<void> {
    switch (await this.close()) {
      case Results.SUCCESS: {
        this.app.project = await Project.from();
        this.emit(AppEvents.APP_LOAD);
      }
    }
  }

  public async [AppEvents.APP_LOAD](): Promise<{
    initial: SerializedProject;
    results: $AnyFixMe;
    project?: ProjectInfo;
  }> {
    const p = this.app.project;
    return {
      initial: this.app.project.toContent(),
      results: this.app.project.toResults(),
      project: {
        id: p.id,
        filename: p.filename,
        filepath: p.filepath,
        directory: p.directory,
        version: this.app.version
      }
    };
  }

  public async [AppEvents.APP_OPEN](filename?: string): Promise<void> {
    switch (await this.close()) {
      case Results.SUCCESS: {
        const name = filename || (await open());
        if (name) {
          this.app.project = await Project.from(name);
          if (this.app.window) {
            this.app.window.setRepresentedFilename(name);
            this.app.electron.addRecentDocument(name);
            this.app.store.set('recent', [name, ...this.app.recent]);
            this.app.setMenu();
          }
          this.emit(AppEvents.APP_LOAD);
        }
      }
    }
  }

  public async [AppEvents.APP_SAVE](): Promise<void> {
    await this.close();
    return;
  }

  public async [AppEvents.APP_PDF_EXPORT_READY](): Promise<void> {
    const target = await save({ pdf: 'PDF Document' });
    if (target) {
      const buffer = await this.app.project.toPDF();
      await promises.writeFile(target, buffer);
    }
    this.send(AppEvents.APP_PDF_EXPORTED);
  }

  /**
   * Attempt to close the current document.
   */
  protected async close(): Promise<Results> {
    const open = this.app.project;

    if (open && open.hasChanges) {
      const res = await warn({
        buttons: [_(T.BTN_CANCEL), _(T.BTN_DELETE), _(T.BTN_SAVE)],
        detail: _(T.SAVE_AS_DETAIL),
        message: _(T.SAVE_AS_MESSAGE, open.filename)
      });

      switch (res) {
        // discard
        case PromptResult.DISCARD: {
          return Results.SUCCESS;
        }
        // cancel
        case PromptResult.CANCEL:
          return Results.CANCEL;
        // attempt to save
        case PromptResult.SAVE: {
          try {
            let file;
            if (!this.app.project.version) {
              const file = save({ mw: 'Markwright' });
              if (!file) {
                // the user bailed
                return Results.CANCEL;
              }
            }
            await this.app.project.save(file);
          } catch (e) {
            return Results.FAILURE;
          }
        }
      }
    }
    return Results.SUCCESS;
  }
}
