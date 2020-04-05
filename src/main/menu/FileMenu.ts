import { AppEvents } from '@common/events';
import _, { T } from '@common/l10n';
import { MenuShorthand } from '@common/types';
import RecentsMenu from './RecentMenu';
import BaseMenu from './BaseMenu';

export default class FileMenu extends BaseMenu {
  public label = _(T.FILE);

  public fileRecent: RecentsMenu = new RecentsMenu(this.app);
  public submenu: MenuShorthand[] = [
    this.fileNew,
    { type: 'separator' },
    this.fileOpen,
    this.fileRecent,
    { type: 'separator' },
    this.fileSave,
    this.fileSaveAs
    // @todo export not currently working
    // { type: 'separator' },
    // this.fileExport
  ];

  public get fileNew(): MenuShorthand {
    return {
      label: _(T.NEW),
      click: () => this.app.events.emit(AppEvents.APP_NEW),
      accelerator: 'CmdOrCtrl+N'
    };
  }

  public get fileOpen(): MenuShorthand {
    return {
      accelerator: 'CmdOrCtrl+O',
      click: () => this.app.events.emit(AppEvents.APP_OPEN),
      label: _(T.OPEN)
    };
  }

  public get fileSave(): MenuShorthand {
    return {
      accelerator: 'CmdOrCtrl+S',
      click: () => this.app.events.emit(AppEvents.APP_SAVE),
      label: _(T.SAVE)
    };
  }

  public get fileSaveAs(): MenuShorthand {
    return {
      accelerator: 'CmdOrCtrl+Shift+S',
      click: () => this.app.events.emit(AppEvents.APP_SAVE_AS),
      label: _(T.SAVE)
    };
  }

  public get fileExport(): MenuShorthand {
    return {
      accelerator: 'CmdOrCtrl+E',
      click: () => this.app.events.emit(AppEvents.APP_PDF_EXPORT),
      label: _(T.EXPORT_TO_PDF)
    };
  }
}
