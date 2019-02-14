import React from 'react';
import { render } from 'react-dom';

import Events from '@common/events';
import { ContentType, IProject } from '@common/types';
import { ContentResponse } from '@main/events/Content';

import Preview from '../components/preview';

type PreviewState = {
  base: string;
  content: {
    [ContentType.STYLES]: string;
    [ContentType.CONTENT]: string;
    [ContentType.METADATA]: $AnyFixMe;
  };
};

class PreviewApp extends React.Component<{}, PreviewState> {
  public state: PreviewState = {
    base: '',
    content: {
      [ContentType.CONTENT]: '',
      [ContentType.STYLES]: '',
      [ContentType.METADATA]: {}
    }
  };

  public componentDidMount() {
    events.on(Events.APP_LOAD, (_: Event, project: IProject) => {
      this.setBase(project.directory + '/');
    });
    events.on(Events.APP_CONTENT_PROCESSED, (_: Event, r: ContentResponse) => {
      if (r.success) {
        this.setState({
          content: { ...this.state.content, [r.type]: r.value }
        });
      }
    });
    events.send(Events.APP_CONNECTED);
  }

  public setBase(dir: string) {
    const base = document.head && document.head.querySelector('base');
    if (base) {
      base.setAttribute('href', dir);
    }
  }

  public render() {
    return <Preview base={this.state.base} data={this.state.content} />;
  }
}

render(<PreviewApp />, document.getElementById('react-root'));
