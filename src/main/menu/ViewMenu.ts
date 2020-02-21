import { MenuShorthand } from '@common/types';
import BaseMenu from './BaseMenu';
import _, { T } from '@common/l10n';

export default class ViewMenu extends BaseMenu {
  public label = _(T.MENU_VIEW);
  public submenu: MenuShorthand[] = [
    { role: 'reload' },
    { role: 'forceReload' },
    { role: 'toggleDevTools' },
    { type: 'separator' },
    { role: 'resetZoom' },
    { role: 'zoomIn' },
    { role: 'zoomOut' },
    { type: 'separator' },
    { role: 'togglefullscreen' }
  ];
}
``;
