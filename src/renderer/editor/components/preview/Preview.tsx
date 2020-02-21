import React, { PropsWithChildren } from 'react';
import cache from 'js-cache';
import Markwright from 'markwright';
import { autobind } from 'core-decorators';

import root from 'react-shadow';

import { ContentType } from '@common/types';
import { PreviewProps } from '.';
import Tooltip from '../tooltip';
import PanZoom from '../pan-zoom';

interface Container {
  width: number;
  height: number;
}

export default class Preview extends React.Component<
  PropsWithChildren<PreviewProps>
> {
  public shadow!: DocumentOrShadowRoot;

  public get container(): Container {
    const z = this.props.scale;
    const height = z <= 1 ? window.innerHeight / z : z * window.innerHeight;
    const width = z <= 1 ? window.innerWidth / z : z * window.innerWidth;
    return { height: +height.toFixed(0), width: +width.toFixed(0) };
  }

  @autobind
  public async highlight(code: string, language: string): Promise<string> {
    const key = `${language}::${code}`;
    const has = cache.get(key);
    if (has) {
      return has;
    } else {
      const res = await this.highlight(code, language);
      cache.set(key, res);
      return res;
    }
  }

  public render(): JSX.Element {
    const container = this.container;
    const metadata = this.props.data[ContentType.METADATA];

    return (
      <root.div
        style={{
          position: 'relative',
          pointerEvents: 'none'
          // top: `calc((${container.height}px - ${height}) * ${scale})`,
          // pointerEvents: this.props.rearranging ? 'none' : 'unset'
        }}
      >
        <PanZoom>
          <Tooltip>
            <Markwright
              container={container}
              context={metadata}
              config={{ columns: 1, highlight: this.highlight }}
              value={this.props.data[ContentType.CONTENT]}
            />
            <style type="text/css">{this.props.data[ContentType.STYLES]}</style>
          </Tooltip>
        </PanZoom>
      </root.div>
    );
  }
}
