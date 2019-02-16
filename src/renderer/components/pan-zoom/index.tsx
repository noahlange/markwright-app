import { autobind } from 'core-decorators';
import panzoom, { PanZoom } from 'panzoom';
import React from 'react';

export default class extends React.Component {
  public handler!: PanZoom;
  public el!: HTMLDivElement;

  @autobind
  public ref(el: HTMLDivElement) {
    this.el = el;
    this.handler = panzoom(this.el, {
      beforeWheel: e => !e.altKey,
      maxZoom: 2.0,
      minZoom: 0.1
    });
  }

  @autobind
  public focus() {
    this.el.focus();
  }

  public componentWillUnmount() {
    this.handler.dispose();
  }

  public render() {
    return (
      <div
        onMouseOver={this.focus}
        style={{ width: '100%', height: '100%' }}
        ref={this.ref}
      >
        {this.props.children}
      </div>
    );
  }
}
