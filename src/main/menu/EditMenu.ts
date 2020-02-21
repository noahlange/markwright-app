import _, { T } from '@common/l10n';
import BaseMenu from './BaseMenu';
import { MenuShorthand } from '@common/types';

export default class EditMenu extends BaseMenu {
  public label = _(T.EDIT);
  public submenu: MenuShorthand[] = [
    { role: 'undo', label: _(T.UNDO), accelerator: 'CmdOrCtrl+Z' },
    { role: 'redo', label: _(T.REDO), accelerator: 'Shift+CmdOrCtrl+Z' },
    { type: 'separator' },
    { role: 'cut', label: _(T.CUT), accelerator: 'CmdOrCtrl+X' },
    { role: 'copy', label: _(T.COPY), accelerator: 'CmdOrCtrl+C' },
    { role: 'undo', label: _(T.PASTE), accelerator: 'CmdOrCtrl+V' },
    { role: 'selectAll', label: _(T.SELECT_ALL), accelerator: 'CmdOrCtrl+A' }
  ];
}
