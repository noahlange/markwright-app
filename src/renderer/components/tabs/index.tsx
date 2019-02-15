import { autobind } from 'core-decorators';
import { Cancelable, debounce } from 'lodash';
import * as React from 'react';

import { ContentType } from '@common/types';
import { listen, unlisten } from '@renderer/utils/listen';
import Editor from '../editor';

type ContentHash = Record<ContentType, string>;

type EditorProps = {
  value: ContentHash | null;
  onChange: (k: ContentType, v: string) => $AnyFixMe;
};

type EditorState = {
  files: ContentHash;
  tab: ContentType;
};

const empty = {
  [ContentType.CONTENT]: '',
  [ContentType.STYLES]: '',
  [ContentType.METADATA]: ''
};

export default class TabbedEditor extends React.Component<
  EditorProps,
  EditorState
> {
  public static tabs: ContentType[] = [
    ContentType.CONTENT,
    ContentType.STYLES,
    ContentType.METADATA
  ];

  public change: Record<ContentType, ((value: string) => any) & Cancelable> = {
    [ContentType.CONTENT]: debounce(this.onChange(ContentType.CONTENT), 125),
    [ContentType.METADATA]: debounce(this.onChange(ContentType.METADATA), 250),
    [ContentType.STYLES]: debounce(this.onChange(ContentType.STYLES), 500)
  };

  public state: EditorState = {
    files: this.props.value || empty,
    tab: ContentType.CONTENT
  };

  @autobind
  public onChange(c: ContentType) {
    return (value: string) => {
      this.setState(
        {
          files: {
            ...this.state.files,
            [c]: value
          }
        },
        () => this.props.onChange(c, value)
      );
    };
  }

  public componentDidMount() {
    listen('keypress', e => {
      if (e.ctrlKey && e.code === 'Tab') {
        const idx =
          (TabbedEditor.tabs.indexOf(this.state.tab) + 1) %
          TabbedEditor.tabs.length;
        this.tab(TabbedEditor.tabs[idx])();
      }
    });
  }

  public componentWillUnmount() {
    unlisten('keypress');
  }

  public tab(tab: ContentType): () => void {
    return () => {
      this.setState({ tab });
    };
  }

  public render() {
    return (
      <div>
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
        <Editor
          path={this.state.tab}
          files={this.state.files}
          wordWrap="bounded"
          onChange={this.change[this.state.tab]}
        />
      </div>
    );
  }
}
