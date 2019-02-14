import React from 'react';
import { Mosaic, MosaicWindow, MosaicParent } from 'react-mosaic-component';
import WebView from 'react-electron-web-view';

import Events from '@common/events';
import { IProject, ContentType } from '@common/types';
import { ContentResponse } from '@main/events/Content';

import Editor from '../editor';
import Problems from '../problems';

type AppState = {
  mosaic: Panes | MosaicParent<Panes> | null;
  project: IProject;
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
    mosaic: {
      direction: 'row',
      first: {
        direction: 'column',
        first: Panes.EDITOR,
        second: Panes.ISSUES,
        splitPercentage: 80
      },
      second: Panes.PREVIEW
    },
    project: {
      errors: {
        [ContentType.CONTENT]: [],
        [ContentType.STYLES]: [],
        [ContentType.METADATA]: []
      },
      content: {
        [ContentType.CONTENT]: '',
        [ContentType.STYLES]: '',
        [ContentType.METADATA]: '{}'
      },
      directory: '',
      filename: 'Untitled.mw'
    }
  };

  public on = {
    changeMosaic: async (mosaic: Panes | MosaicParent<Panes> | null) => {
      this.setState({ mosaic });
    },
    changeContent: async (type: ContentType, value: string) => {
      if (this.state.project) {
        const { project } = this.state;
        this.setState(
          {
            project: {
              ...project,
              content: {
                ...project.content,
                [type]: value
              }
            }
          },
          () => {
            events.send(Events.APP_CONTENT_PROCESS, { type, value });
          }
        );
      }
    }
  };

  public async componentDidMount() {
    const types = [
      ContentType.CONTENT,
      ContentType.STYLES,
      ContentType.METADATA
    ];

    events.on(Events.APP_LOAD, async (_, project: IProject) => {
      this.setState({ project });
      for (const type of types) {
        events.send(Events.APP_CONTENT_PROCESS, {
          type,
          value: project.content[type]
        });
      }
    });

    events.on(Events.APP_CONTENT_PROCESSED, (_, res: ContentResponse) => {
      const project = this.state.project;
      project.errors[res.type] = res.errors;
      this.setState({ project });
    });

    events.send(Events.APP_CONNECTED);
  }

  public render() {
    if (this.state.project) {
      const props = {
        content: { ...this.state.project.content },
        errors: { ...this.state.project.errors }
      };
      const panes = {
        [Panes.EDITOR]: () => (
          <Editor
            defaultValue={props.content}
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
            <div className="editor">
              <header>{this.state.project.filename}</header>
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
    return null;
  }
}
