import Events from '@common/events';
import App from '@main/App';
import { basename } from 'path';

export default function(app: App) {
  return {
    label: 'File',
    submenu: [
      {
        accelerator: 'CmdOrCtrl+N',
        click: () => app.emit(Events.APP_NEW),
        label: 'New',
        role: 'new'
      },
      {
        accelerator: 'CmdOrCtrl+O',
        click: () => app.emit(Events.APP_OPEN),
        label: 'Open',
        role: 'open'
      },
      app.recent.length
        ? {
            label: 'Open Recent',
            submenu: [
              ...app.recent.map(filename => ({
                click: () => app.emit(Events.APP_OPEN_RECENT, filename),
                label: basename(filename)
              })),
              { type: 'separator' },
              {
                click: () => {
                  app.recent = [];
                  app.setMenu();
                },
                label: 'Clear Menu'
              }
            ]
          }
        : null,
      {
        accelerator: 'CmdOrCtrl+S',
        click: () => app.emit(Events.APP_SAVE),
        label: 'Save',
        role: 'save'
      },
      { type: 'separator' },
      {
        accelerator: 'CmdOrCtrl+E',
        click: () => app.emit(Events.APP_EXPORT_PDF),
        label: 'Export to PDF',
        role: 'print'
      }
    ]
  };
}
