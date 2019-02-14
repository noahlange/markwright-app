import App from '@main/App';

import { MenuItemConstructorOptions } from 'electron';

export default function(app: App): MenuItemConstructorOptions {
  return {
    role: 'window',
    submenu: [{ role: 'minimize' }, { role: 'close' }]
  };
}
