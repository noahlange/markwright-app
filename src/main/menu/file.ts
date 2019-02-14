import Events from '@common/events';
import App from '@main/App';
import { MenuItemConstructorOptions } from 'electron';

export default function(app: App): MenuItemConstructorOptions {
  return {
    label: 'File',
    submenu: [
      {
        accelerator: 'Cmd+O',
        click: () => app.emit(Events.APP_OPEN),
        label: 'Open',
        role: 'open'
      },
      {
        accelerator: 'Cmd+S',
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
      {
        accelerator: 'Cmd+Shift+E',
        click: () => app.emit(Events.APP_EXPORT_PDF),
        label: 'Export to PDF',
        role: 'print'
      }
    ]
  };
}
