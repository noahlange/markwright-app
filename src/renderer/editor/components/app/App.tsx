import React from 'react';
import {
  Mosaic,
  MosaicParent,
  MosaicWindow,
  MosaicBranch
} from 'react-mosaic-component';

import { Editor, Preview, Problems, Tabs } from '@editor/components';
import { _, T } from '@common';

import { AppProps } from './index';

export type MosaicThingy = Panes | MosaicParent<Panes> | null;

interface AppState {
  rearranging: boolean;
  mosaic: MosaicThingy;
}

export enum Panes {
  EDITOR,
  PREVIEW,
  ISSUES
}

export default class Markwright extends React.Component<AppProps, AppState> {
  public static titles: Record<Panes, string> = {
    [Panes.EDITOR]: _(T.PANE_CONTENT),
    [Panes.ISSUES]: _(T.PANE_PROBLEMS),
    [Panes.PREVIEW]: _(T.PANE_PREVIEW)
  };

  public state: AppState = {
    rearranging: false,
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
    changeMosaic: (mosaic: MosaicThingy) => {
      this.setState({ mosaic, rearranging: true });
    },
    releaseMoasic: (mosaic: MosaicThingy) => {
      this.setState({ rearranging: false }, () => this.props.layout(mosaic));
    }
  };

  public async componentDidMount(): Promise<void> {
    await this.props.onLoad();
  }

  public render(): JSX.Element {
    const panes = {
      [Panes.EDITOR]: (
        <Tabs>
          <Editor />
        </Tabs>
      ),
      [Panes.ISSUES]: <Problems />,
      [Panes.PREVIEW]: <Preview rearranging={this.state.rearranging} />
    };
    return (
      <>
        <div className="flex">
          <div className="editor">
            <header>{this.props.filename}</header>
          </div>
          <Mosaic
            className=""
            onChange={this.on.changeMosaic}
            onRelease={this.on.releaseMoasic}
            renderTile={(e: Panes, path: MosaicBranch[]) => {
              return (
                <MosaicWindow
                  path={path}
                  toolbarControls={[]}
                  title={Markwright.titles[e]}
                >
                  {panes[e]}
                </MosaicWindow>
              );
            }}
            value={this.state.mosaic}
          />
        </div>
      </>
    );
  }
}
