import { autobind } from 'core-decorators';
import React, { MouseEvent } from 'react';

type DomTooltipState = {
  element: HTMLElement | null;
};

export default class Tooltip extends React.Component {
  public target!: HTMLDivElement;
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
      fontFamily: 'var(--font-mono)',
      fontSize: '12px',
      left: '-1px',
      padding: '4px',
      position: 'absolute',
      top: '-1px'
    };
  }

  public get tooltipStyle(): React.CSSProperties {
    if (this.state.element) {
      const rect = this.state.element.getBoundingClientRect();
      return {
        backgroundColor: 'rgba(0, 0, 0, 0.25)',
        border: '1px solid rgba(0, 0, 0, 0.5)',
        boxSizing: 'border-box',
        height: `${rect.height}px`,
        left: `${rect.left}px`,
        pointerEvents: 'none',
        position: 'absolute',
        top: `${rect.top + window.scrollY}px`,
        width: `${rect.width}px`,
        zIndex: 100
      };
    } else {
      return {
        display: 'none'
      };
    }
  }

  public get hintText() {
    if (this.state.element) {
      const id = this.state.element.id ? `#${this.state.element.id}` : '';
      const tag = this.state.element.tagName.toLowerCase();
      const classes = this.state.element.className.split(' ').join('.');
      return `${tag}${id}${classes ? `.${classes}` : ''}`;
    } else {
      return '';
    }
  }

  @autobind
  public onMouseMove(e: MouseEvent) {
    this.mouse.x = e.clientX;
    this.mouse.y = e.clientY;
  }

  public componentDidMount() {
    document.body.addEventListener('keydown', e => {
      if (e.ctrlKey) {
        this.setState({
          element: document.elementFromPoint(this.mouse.x, this.mouse.y)
        });
      }
    });

    document.body.addEventListener('keyup', e => {
      if (this.state.element) {
        this.setState({ element: null, active: false });
      }
    });
  }

  public render() {
    return (
      <div onMouseMove={this.onMouseMove}>
        <div id="tooltip-container">
          {this.state.element ? (
            <div style={this.tooltipStyle}>
              <span style={this.hintStyle}>{this.hintText}</span>
            </div>
          ) : null}
        </div>
        <div
          id="tooltip-target"
          ref={(e: HTMLDivElement) => (this.target = e)}
          style={{ pointerEvents: 'auto', outline: 'none' }}
        >
          {this.props.children}
        </div>
      </div>
    );
  }
}
