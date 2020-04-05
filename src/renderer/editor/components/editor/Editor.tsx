import * as m from 'monaco-editor';
import React from 'react';
import Monaco from 'react-monaco-editor';

import { EditorProps } from './index';

import { ContentType } from '@common/types';
import { debounce } from 'debounce';

const exts: Record<ContentType, string> = {
  [ContentType.CONTENT]: '.md',
  [ContentType.STYLES]: '.scss',
  [ContentType.METADATA]: '.json'
};

const lang: Record<ContentType, string> = {
  [ContentType.CONTENT]: 'markdown',
  [ContentType.STYLES]: 'scss',
  [ContentType.METADATA]: 'json'
};

export default class Editor extends React.Component<EditorProps> {
  public dom!: Monaco;
  public editor!: m.editor.IStandaloneCodeEditor;

  public resize = debounce(
    () =>
      this.editor?.layout({
        width: this.props.width,
        height: this.props.height
      }),
    250
  );

  public get language(): string {
    return lang[this.props.type];
  }

  public componentDidUpdate(): void {
    const editor = this.dom.editor;
    if (editor) {
      this.editor = editor;
      const type = this.props.type;
      const id = this.props.id;
      const prev = editor.getModel();
      const uri = m.Uri.parse(`file:///${id}.${type}${exts[type]}`);
      if (prev?.uri.toString() !== uri.toString()) {
        const next =
          m.editor.getModel(uri) ||
          m.editor.createModel(this.props.value, lang[type], uri);
        next.updateOptions({ tabSize: 2 });
        editor.setModel(next);
      }
    }
  }

  public componentDidMount(): void {
    window.addEventListener('resize', this.resize);
  }

  public componentWillUnmount(): void {
    window.removeEventListener('resize', this.resize);
    this.editor?.dispose();
    this.onChange.clear();
    this.resize.clear();
  }

  public onChange = debounce((text: string) => {
    this.props.onChange(this.props.type, text);
    this.props.onProcess(this.props.type, text);
  }, 250);

  public render(): JSX.Element {
    return (
      <Monaco
        theme="vs-dark"
        width={this.props.width}
        height={this.props.height}
        defaultValue={this.props.value}
        onChange={this.onChange}
        ref={ref => (this.dom = ref as Monaco)}
        language={this.language}
        options={{
          fontFamily: 'Fira Code',
          fontLigatures: true,
          fontSize: 15,
          wordWrap: 'bounded'
        }}
      />
    );
  }
}
