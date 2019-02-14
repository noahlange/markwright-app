import { autobind } from 'core-decorators';
import { Cancelable, debounce } from 'lodash';
import * as Monaco from 'monaco-editor';
import * as React from 'react';
import MonacoEditor from 'react-monaco-editor';

import { ContentType } from '@common/types';
import { listen, unlisten } from '@renderer/utils/listen';

type ContentHash = Record<ContentType, string>;

type EditorProps = {
  defaultValue: ContentHash | null;
  onChange: (k: ContentType, v: string) => $AnyFixMe;
};

type EditorState = {
  initial: ContentHash;
  content: ContentHash;
  tab: ContentType;
};

function matches<A extends ContentHash, B extends ContentHash>(
  o1: A | null,
  o2: B | null,
  k: ContentType
) {
  return o1 && o2 && o1[k] === o2[k];
}

export default class Editor extends React.Component<EditorProps, EditorState> {
  public static getDerivedStateFromProps(
    nextProps: EditorProps,
    prevState: EditorState
  ) {
    if (matches(nextProps.defaultValue, prevState.initial, prevState.tab)) {
      return null;
    } else {
      return nextProps.defaultValue
        ? {
            content: nextProps.defaultValue,
            initial: nextProps.defaultValue
          }
        : null;
    }
  }

  public editor!: Monaco.editor.IEditor;

  public change: Record<ContentType, ((value: string) => any) & Cancelable> = {
    [ContentType.CONTENT]: debounce(this.onChangeMarkdown, 125),
    [ContentType.METADATA]: debounce(this.onChangeMetadata, 250),
    [ContentType.STYLES]: debounce(this.onChangeSCSS, 500)
  };

  public languages: Record<ContentType, string> = {
    [ContentType.CONTENT]: 'markdown',
    [ContentType.METADATA]: 'json',
    [ContentType.STYLES]: 'scss'
  };

  public state: EditorState = {
    content: {
      [ContentType.STYLES]: '',
      [ContentType.METADATA]: '{}',
      [ContentType.CONTENT]: ''
    },
    initial: {
      [ContentType.STYLES]: '',
      [ContentType.METADATA]: '{}',
      [ContentType.CONTENT]: ''
    },
    tab: ContentType.CONTENT
  };

  @autobind
  public handleResize() {
    this.editor.layout();
  }

  @autobind
  public onChangeSCSS(e: string) {
    return this.onChange(e);
  }

  @autobind
  public onChangeMetadata(e: string) {
    return this.onChange(e);
  }

  @autobind
  public onChangeMarkdown(e: string) {
    return this.onChange(e);
  }

  @autobind
  public onChange(e: string) {
    this.setState(
      {
        content: {
          ...this.state.content,
          [this.state.tab]: e
        }
      },
      () => {
        this.props.onChange(this.state.tab, e);
      }
    );
  }

  @autobind
  public editorWillMount(monaco: typeof Monaco) {
    monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
      allowComments: true,
      schemas: [
        {
          fileMatch: ['*'],
          schema: {},
          uri: 'mw://themes/markwright.json'
        }
      ]
    });
  }

  @autobind
  public editorDidMount(editor: Monaco.editor.ICodeEditor) {
    editor.getModel().updateOptions({ tabSize: 2 });
    this.editor = editor;
    this.editor.focus();
    this.editor.layout();
  }

  @autobind
  public focus() {
    this.editor.focus();
  }

  public componentDidMount() {
    const tabs: ContentType[] = [
      ContentType.CONTENT,
      ContentType.STYLES,
      ContentType.METADATA
    ];
    listen('resize', this.handleResize);
    listen('keypress', e => {
      if (e.ctrlKey && e.code === 'Tab') {
        const idx = (tabs.indexOf(this.state.tab) + 1) % tabs.length;
        this.change[this.state.tab].flush();
        this.setState({ tab: tabs[idx] });
      }
    });
  }

  public componentWillUnmount() {
    unlisten('keypress', 'resize');
  }

  public tab(tab: ContentType): () => void {
    return () => this.setState({ tab });
  }

  public render() {
    return (
      <div
        id="monaco-container"
        style={{ width: '100%' }}
        onMouseOver={this.focus}
      >
        <div className={`tabs ${this.state.tab}`}>
          <button className="content" onClick={this.tab(ContentType.CONTENT)}>
            Content (Markdown)
          </button>
          <button className="styles" onClick={this.tab(ContentType.STYLES)}>
            Styles (SCSS)
          </button>
          <button className="metadata" onClick={this.tab(ContentType.METADATA)}>
            Metadata (JSON)
          </button>
        </div>
        <MonacoEditor
          theme="vs-dark"
          options={{
            fontFamily: 'Liga Inconsolata',
            fontLigatures: true,
            fontSize: 15,
            wordWrap: 'bounded'
          }}
          editorWillMount={this.editorWillMount}
          editorDidMount={this.editorDidMount}
          language={this.languages[this.state.tab]}
          onChange={this.change[this.state.tab]}
          value={this.state.content[this.state.tab]}
        />
      </div>
    );
  }
}
