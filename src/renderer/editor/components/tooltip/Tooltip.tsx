import React from 'react';

import { TooltipProps } from '.';

interface DomTooltipState {
  element: HTMLElement | null;
}

export default class Tooltip extends React.Component<
  React.PropsWithChildren<TooltipProps>,
  DomTooltipState
> {
  public wheel!: HTMLElement;
  public target!: HTMLElement;

  public state: DomTooltipState = {
    element: null
  };

  public mouse = {
    x: 0,
    y: 0
  };

  public get hintStyle(): React.CSSProperties {
    return {
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      borderRadius: '2px',
      color: 'white',
      cursor: 'none',
      display: 'block',
      fontFamily: 'var(--mono-stack)',
      fontSize: '12px',
      left: '-1px',
      padding: '4px',
      position: 'absolute',
      top: '-1px'
    };
  }

  public get tooltipStyle(): React.CSSProperties {
    if (this.state.element) {
      const container = this.wheel.getBoundingClientRect();
      const rect = this.state.element.getBoundingClientRect();

      const top = rect.top - container.top;
      const left = rect.left - container.left;

      return {
        backgroundColor: 'rgba(0, 0, 0, 0.25)',
        border: '1px solid rgba(0, 0, 0, 0.5)',
        boxSizing: 'border-box',
        height: `${rect.height / this.props.scale}px`,
        width: `${rect.width / this.props.scale}px`,
        pointerEvents: 'none',
        position: 'absolute',
        top: `${top / this.props.scale}px`,
        left: `${left / this.props.scale}px`,
        zIndex: 100
      };
    } else {
      return {
        display: 'none'
      };
    }
  }

  public get hintText(): string {
    if (this.state.element) {
      const id = this.state.element.id ? `#${this.state.element.id}` : '';
      const tag = this.state.element.tagName.toLowerCase();
      const classes = this.state.element.className.split(' ').join('.');
      return `${tag}${id}${classes ? `.${classes}` : ''}`;
    } else {
      return '';
    }
  }

  public onKeyUp = () => {
    if (this.state.element) {
      this.setState({ element: null });
    }
  };

  public onKeyDown = (e: KeyboardEvent) => {
    if (e.altKey && this.wheel) {
      this.setState({ element: this.target });
    }
  };

  public onMouseOver = (e: React.MouseEvent<HTMLElement>) => {
    this.target = e.target as HTMLElement;
  };

  public componentDidMount(): void {
    document.addEventListener('keydown', this.onKeyDown);
    document.addEventListener('keyup', this.onKeyUp);
  }

  public wheelRef = (ref: any) => {
    this.wheel = ref;
  };

  public render(): JSX.Element {
    return (
      <>
        <div id="tooltip-container">
          {this.state.element ? (
            <div style={this.tooltipStyle}>
              <span style={this.hintStyle}>{this.hintText}</span>
            </div>
          ) : null}
        </div>
        <div
          ref={this.wheelRef}
          style={{ pointerEvents: 'auto' }}
          onMouseOver={this.onMouseOver}
        >
          {this.props.children}
        </div>
      </>
    );
  }
}
