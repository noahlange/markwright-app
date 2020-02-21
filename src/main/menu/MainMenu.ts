import BaseMenu from './BaseMenu';
import { MenuShorthand } from '@common/types';

export default class MainMenu extends BaseMenu {
  public get isShown(): boolean {
    return this.app.isMac;
  }

  public get label(): string {
    return this.app.electron.getName();
  }

  public submenu: MenuShorthand[] = [
    { role: 'about' },
    { type: 'separator' },
    { role: 'hide' },
    { role: 'hideOthers' },
    { role: 'unhide' },
    { type: 'separator' },
    { role: 'quit' }
  ];
}
