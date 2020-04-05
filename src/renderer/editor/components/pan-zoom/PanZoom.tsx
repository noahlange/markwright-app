import React from 'react';
import panAndZoomHoc from 'react-pan-and-zoom-hoc';
import { getScaleMultiplier } from '@editor/redux/ui/utils';
import { PanZoomProps } from './';

const InteractiveDiv = panAndZoomHoc('div');

export interface PanZoomInfo {
  x: number;
  y: number;
  scale: number;
}

export default class PanZoom extends React.Component<
  React.PropsWithChildren<PanZoomProps>
> {
  public onChange = (state: Partial<PanZoomInfo>): void => {
    const { x = 0, y = 0, scale = 1 } = { ...this.props, ...state };
    this.props.onPanZoom({ x, y, scale });
  };

  public handlePan = (x: number, y: number): void => {
    this.onChange({
      x: x + 2 * (this.props.x - x),
      y: y + 2 * (this.props.y - y)
    });
  };

  public handleZoom = (
    s: number = this.props.scale,
    event: WheelEvent
  ): void => {
    this.onChange({ scale: s * getScaleMultiplier(event.deltaY) });
  };

  public handlePanAndZoom = (x: number, y: number, s: number): void => {
    this.onChange({
      scale: s * getScaleMultiplier(s - this.props.scale),
      x: x + 2 * (this.props.x - x),
      y: y + 2 * (this.props.y - y)
    });
  };

  public render(): JSX.Element {
    const { x, y, scale } = this.props;
    const transform = [
      `translateX(${x * 500}px)`,
      `translateY(${y * 500}px)`,
      `scale(${scale})`
    ].join(' ');

    return (
      <InteractiveDiv
        x={x}
        y={y}
        scale={scale}
        disableZoomToMouse
        onPanAndZoom={this.handlePanAndZoom}
        onZoom={(x, y, z, e) => this.handleZoom(z, e)}
        onPanMove={this.handlePan}
        style={{
          width: '100%',
          height: '100%',
          pointerEvents: 'auto',
          position: 'relative'
        }}
      >
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            transform
          }}
        >
          {this.props.children}
        </div>
      </InteractiveDiv>
    );
  }
}
