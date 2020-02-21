import BaseMenu from './BaseMenu';
import { MenuShorthand } from '@common/types';
import _, { T } from '@common/l10n';

export default class extends BaseMenu {
  public label = _(T.MENU_WINDOW);
  public submenu: MenuShorthand[] = [{ role: 'minimize' }, { role: 'close' }];
}
