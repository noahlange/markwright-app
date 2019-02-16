import Events from '@common/events';
import App from '@main/App';
import { MenuItemConstructorOptions } from 'electron';

export default function(app: App): MenuItemConstructorOptions {
  return {
    label: 'File',
    submenu: [
      // New
      {
        accelerator: 'CmdOrCtrl+O',
        click: () => app.emit(Events.APP_OPEN),
        label: 'Open',
        role: 'open'
      },
      {
        accelerator: 'CmdOrCtrl+S',
        click: () => app.emit(Events.APP_SAVE),
        label: 'Save',
        role: 'save'
      },
      // {
      //   label: 'Save as',
      //   role: 'save-as',
      //   accelerator: 'Cmd+Shift+S',
      //   click: () => app.emit(Events.APP_SAVE_AS)
      // },
      { role: 'separator' },
      {
        accelerator: 'CmdOrCtrl+E',
        click: () => app.emit(Events.APP_EXPORT_PDF),
        label: 'Export to PDF',
        role: 'print'
      }
    ]
  };
}
