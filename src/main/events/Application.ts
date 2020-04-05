import Events, { AppEvents } from '@common/events';
import _, { T } from '@common/l10n';
import Project, { SerializedProject, ProjectInfo } from '@main/lib/Project';

import { promises } from 'fs';

import EventBus from './Bus';
import { open, save, warn } from '@main/util/dialog';
import { ContentType, ProcessResult } from '@common/types';

enum Result {
  SUCCESS,
  FAILURE,
  CANCEL
}

export enum PromptResult {
  CANCEL = 0,
  DISCARD = 1,
  SAVE = 2
}

interface Dimensions {
  width: number;
  height: number;
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
      case Result.SUCCESS:
        return true;
      case Result.FAILURE:
      case Result.CANCEL:
        return false;
    }
  }

  public async [AppEvents.APP_NEW](): Promise<void> {
    switch (await this.close()) {
      case Result.SUCCESS: {
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
      case Result.SUCCESS: {
        const name = filename ?? (await open());
        if (name) {
          await this.open(name);
        }
      }
    }
  }

  /**
   * Create a new file with the current project contents.
   */
  public async [AppEvents.APP_SAVE_AS](): Promise<void> {
    await this.save(true);
    this.emit(AppEvents.APP_LOAD);
  }

  public async [AppEvents.APP_SAVE](): Promise<void> {
    // re-populate client store
    await this.save();
    this.emit(AppEvents.APP_LOAD);
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
   * Open a project at a specified filename;
   */
  protected async open(filename: string): Promise<void> {
    this.app.project = await Project.from(filename);
    if (this.app.window) {
      this.app.window.setRepresentedFilename(filename);
      this.app.electron.addRecentDocument(filename);
      this.app.store.set('recent', [filename, ...this.app.recent]);
      this.app.setMenu();
    }
    this.emit(AppEvents.APP_LOAD);
  }

  protected async save(saveAs?: boolean): Promise<unknown> {
    // prompt if the file doesn't currently exist
    let filename;
    if (saveAs || !this.app.project.fileExists) {
      filename = await save({ mw: 'Markwright' });
      if (!filename) {
        return Result.CANCEL;
      }
    }
    try {
      await this.app.project.save(filename);
      return Result.SUCCESS;
    } catch (e) {
      return Result.FAILURE;
    }
  }

  /**
   * Attempt to close the current document.
   */
  protected async close(): Promise<Result> {
    const open = this.app.project;

    if (open?.hasChanges) {
      // the project has unsaved changes
      const res = await warn({
        buttons: [_(T.BTN_CANCEL), _(T.BTN_DELETE), _(T.BTN_SAVE)],
        detail: _(T.SAVE_AS_DETAIL),
        message: _(T.SAVE_AS_MESSAGE, open.filename)
      });

      switch (res) {
        // discard
        case PromptResult.DISCARD: {
          // create blank project
          try {
            this.app.project = await Project.from();
            return Result.SUCCESS;
          } catch (e) {
            return Result.FAILURE;
          }
        }
        // attempt to save
        case PromptResult.SAVE: {
          try {
            await this[AppEvents.APP_SAVE]();
            return Result.SUCCESS;
          } catch (e) {
            return Result.FAILURE;
          }
        }
        // cancel
        case PromptResult.CANCEL: {
          return Result.CANCEL;
        }
      }
    }
    return Result.SUCCESS;
  }
}
