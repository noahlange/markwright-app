import App from '@main/App';
import { MenuItemConstructorOptions } from 'electron';

export default function(app: App): MenuItemConstructorOptions | null {
  return app.platform === 'win32'
    ? null
    : {
        label: app.electron.getName(),
        submenu: [
          { role: 'about' },
          { type: 'separator' },
          { role: 'hide' },
          { role: 'hideothers' },
          { role: 'unhide' },
          { type: 'separator' },
          { role: 'quit' }
        ]
      };
}
