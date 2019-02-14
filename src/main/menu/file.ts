import App from '@main/App';
import Events from '@common/events';
import { MenuItemConstructorOptions } from 'electron';

export default function(app: App): MenuItemConstructorOptions {
  return {
    label: 'File',
    submenu: [
      {
        label: 'Open',
        role: 'open',
        accelerator: 'Cmd+O',
        click: () => app.emit(Events.APP_OPEN)
      },
      {
        label: 'Save',
        role: 'save',
        accelerator: 'Cmd+S',
        click: () => app.emit(Events.APP_SAVE)
      },
      // {
      //   label: 'Save as',
      //   role: 'save-as',
      //   accelerator: 'Cmd+Shift+S',
      //   click: () => app.emit(Events.APP_SAVE_AS)
      // },
      {
        label: 'Export to PDF',
        role: 'print',
        accelerator: 'Cmd+Shift+E',
        click: () => app.emit(Events.APP_EXPORT_PDF)
      }
    ]
  };
}
