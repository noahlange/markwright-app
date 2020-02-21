import * as React from 'react';

import _, { T } from '@common/l10n';
import { ContentType } from '@common/types';
import { listen, unlisten } from '@utils/dom';
import { TabsProps, TabsActions } from '.';

export default class Tabs extends React.Component<TabsProps & TabsActions> {
  public componentDidMount(): void {
    const order = [
      ContentType.CONTENT,
      ContentType.STYLES,
      ContentType.METADATA
    ];
    // listen to all keyboard events; user isn't guaranteed to be focused.
    listen('keydown', e => {
      if (e.ctrlKey && e.code === 'Tab') {
        const idx = (order.indexOf(this.props.tab) + 1) % order.length;
        this.props.changeTab(order[idx]);
      }
    });
  }

  public componentWillUnmount(): void {
    unlisten('keydown');
  }

  public render(): JSX.Element {
    const change = (t: ContentType) => () => this.props.changeTab(t);
    return (
      <div>
        <div className={`tabs ${this.props.tab}`}>
          <button className="content" onClick={change(ContentType.CONTENT)}>
            {_(T.TAB_CONTENT)}
          </button>
          <button className="styles" onClick={change(ContentType.STYLES)}>
            {_(T.TAB_STYLES)}
          </button>
          <button className="metadata" onClick={change(ContentType.METADATA)}>
            {_(T.TAB_METADATA)}
          </button>
        </div>
        {this.props.children}
      </div>
    );
  }
}
