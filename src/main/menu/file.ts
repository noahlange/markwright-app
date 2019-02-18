import Events from '@common/events';
import _, { T } from '@common/l10n';
import App from '@main/App';
import { basename } from 'path';

export default function(app: App) {
  return {
    label: _(T.FILE),
    submenu: [
      {
        accelerator: 'CmdOrCtrl+N',
        click: () => app.emit(Events.APP_NEW),
        label: _(T.NEW),
        role: 'new'
      },
      {
        accelerator: 'CmdOrCtrl+O',
        click: () => app.emit(Events.APP_OPEN_PROMPT),
        label: _(T.OPEN),
        role: 'open'
      },
      app.recent.length
        ? {
            label: _(T.OPEN_RECENT),
            submenu: [
              ...app.recent.map(filename => ({
                click: () => app.emit(Events.APP_OPEN_FILE, filename),
                label: basename(filename)
              })),
              { type: 'separator' },
              {
                click: () => {
                  app.recent = [];
                  app.setMenu();
                },
                label: _(T.CLEAR_MENU)
              }
            ]
          }
        : null,
      {
        accelerator: 'CmdOrCtrl+S',
        click: () => app.emit(Events.APP_SAVE),
        label: _(T.SAVE),
        role: 'save'
      },
      { type: 'separator' },
      {
        accelerator: 'CmdOrCtrl+E',
        click: () => app.emit(Events.APP_EXPORT_PDF),
        label: _(T.EXPORT_TO_PDF),
        role: 'print'
      }
    ]
  };
}
