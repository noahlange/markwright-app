import { autobind } from 'core-decorators';
import panzoom, { PanZoom } from 'panzoom';
import React from 'react';

export default class extends React.Component {
  public handler!: PanZoom;

  @autobind
  public ref(el: HTMLDivElement) {
    this.handler = panzoom(el, {
      beforeWheel: e => !e.altKey
    });
  }

  public componentWillUnmount() {
    this.handler.dispose();
  }

  public render() {
    return (
      <div
        style={{ width: '100%', height: '100%', outline: 'none' }}
        ref={this.ref}
      >
        {this.props.children}
      </div>
    );
  }
}
