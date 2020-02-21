import { MenuShorthand } from '@common/types';
import App from '@main/lib/App';

abstract class BaseMenu implements MenuShorthand {
  public submenu!: MenuShorthand[];
  public isShown!: boolean;
  public label!: string;
  public app: App;

  public constructor(app: App) {
    this.app = app;
  }
}

export default BaseMenu;
