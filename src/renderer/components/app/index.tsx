import React from 'react';
import WebView from 'react-electron-web-view';
import { Mosaic, MosaicParent, MosaicWindow } from 'react-mosaic-component';

import Events from '@common/events';
import { ContentType, IProject } from '@common/types';
import { ContentResponse } from '@main/events/Content';

import { listen } from '@renderer/utils/listen';
import Problems from '../problems';
import Editor from '../tabs';

type AppState = IProject & {
  mosaic: Panes | MosaicParent<Panes> | null;
  load: number;
};

enum Panes {
  EDITOR,
  PREVIEW,
  ISSUES
}

const TypedMosaic = Mosaic.ofType<Panes>();
const TypedWindow = MosaicWindow.ofType<Panes>();

export default class Markwright extends React.Component<{}, AppState> {
  public static titles: Record<Panes, string> = {
    [Panes.EDITOR]: 'Editor',
    [Panes.ISSUES]: 'Problems',
    [Panes.PREVIEW]: 'Preview'
  };

  public state: AppState = {
    content: {
      [ContentType.CONTENT]: '',
      [ContentType.STYLES]: '',
      [ContentType.METADATA]: '{}'
    },
    directory: '',
    errors: {
      [ContentType.CONTENT]: [],
      [ContentType.STYLES]: [],
      [ContentType.METADATA]: []
    },
    filename: 'Untitled.mw',
    load: Date.now(),
    mosaic: {
      direction: 'row',
      first: {
        direction: 'column',
        first: Panes.EDITOR,
        second: Panes.ISSUES,
        splitPercentage: 80
      },
      second: Panes.PREVIEW
    }
  };

  public on = {
    changeContent: async (type: ContentType, value: string) => {
      events.send(Events.APP_CONTENT_PROCESS, { type, value });
    },
    changeMosaic: async (mosaic: Panes | MosaicParent<Panes> | null) => {
      this.setState({ mosaic });
    }
  };

  public async componentDidMount() {
    const types = [
      ContentType.CONTENT,
      ContentType.STYLES,
      ContentType.METADATA
    ];

    events.on(Events.APP_LOAD, async (_, project: IProject) => {
      this.setState({ ...project, load: Date.now() });
      for (const type of types) {
        events.send(Events.APP_CONTENT_PROCESS, {
          type,
          value: project.content[type]
        });
      }
    });

    events.on(Events.APP_CONTENT_PROCESSED, (_, res: ContentResponse) => {
      this.setState({
        errors: {
          ...this.state.errors,
          [res.type]: res.errors
        }
      });
    });

    events.send(Events.APP_CONNECTED);
    events.send(Events.APP_READY_EDITOR);

    listen('resize', _ => {
      events.send(Events.WINDOW_RESIZED, {
        height: window.outerHeight,
        width: window.outerWidth
      });
    });
  }

  public render() {
    const props = {
      content: { ...this.state.content },
      errors: { ...this.state.errors },
      load: this.state.load
    };
    const panes = {
      [Panes.EDITOR]: () => (
        <Editor
          timestamp={props.load}
          value={props.content}
          onChange={this.on.changeContent}
        />
      ),
      [Panes.ISSUES]: () => <Problems data={props.errors} />,
      [Panes.PREVIEW]: () => (
        <WebView
          blinkfeatures="OverlayScrollbars"
          src={'preview.html'}
          preload={'./scripts/preload.js'}
        />
      )
    };
    return (
      <>
        <div className="flex">
          <div className="editor" style={{ pointerEvents: 'none' }}>
            <header>{this.state.filename}</header>
          </div>
          <TypedMosaic
            className=""
            renderTile={(e, path) => (
              <TypedWindow
                path={path}
                toolbarControls={[]}
                title={Markwright.titles[e]}
                // need to pass this so the mosaic will detect updates to children
                {...props}
              >
                {panes[e]()}
              </TypedWindow>
            )}
            value={this.state.mosaic}
            onChange={this.on.changeMosaic}
          />
        </div>
      </>
    );
  }
}
