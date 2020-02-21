import _, { T } from '@common/l10n';
import { MenuShorthand } from '@common/types';
import { basename } from 'path';
import { AppEvents } from '@common/events';
import BaseMenu from './BaseMenu';

export default class RecentsMenu extends BaseMenu {
  public label = _(T.OPEN_RECENT);

  public get recentClear(): MenuShorthand {
    return {
      click: () => {
        this.app.recent = [];
        this.app.setMenu();
      },
      label: _(T.CLEAR_MENU)
    };
  }

  public get recentList(): MenuShorthand[] {
    return [
      ...this.app.recent.reverse().map(filename => ({
        click: () => this.app.events.emit(AppEvents.APP_OPEN, filename),
        label: basename(filename)
      })),
      { type: 'separator' }
    ];
  }

  public get recentOpen(): MenuShorthand {
    return {
      label: _(T.OPEN_RECENT),
      submenu: this.recentList
    };
  }

  public get submenu(): MenuShorthand[] {
    return this.app.recent.length ? [this.recentOpen, this.recentClear] : [];
  }

  public set submenu(_: MenuShorthand[]) {
    return;
  }
}
