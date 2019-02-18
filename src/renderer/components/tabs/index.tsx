import { autobind } from 'core-decorators';
import { Cancelable, debounce } from 'lodash';
import * as React from 'react';

import _, { T } from '@common/l10n';
import { ContentType } from '@common/types';
import { listen, unlisten } from '@renderer/utils/listen';
import Editor from '../editor';

type ContentHash = Record<ContentType, string>;

type EditorProps = {
  value: ContentHash;
  timestamp: number;
  onChange: (k: ContentType, v: string) => $AnyFixMe;
};

type EditorState = {
  timestamp: number;
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

  public static getDerivedStateFromProps(
    nextProps: EditorProps,
    prevState: EditorState
  ) {
    if (nextProps.timestamp > prevState.timestamp) {
      let changed = false;
      for (const tab of TabbedEditor.tabs) {
        if (nextProps.value[tab] !== prevState.files[tab]) {
          changed = true;
        }
      }
      return changed
        ? {
            files: nextProps.value,
            timestamp: nextProps.timestamp
          }
        : null;
    }
    return null;
  }

  public change: Record<ContentType, ((value: string) => any) & Cancelable> = {
    [ContentType.CONTENT]: debounce(this.onChange(ContentType.CONTENT), 125),
    [ContentType.METADATA]: debounce(this.onChange(ContentType.METADATA), 250),
    [ContentType.STYLES]: debounce(this.onChange(ContentType.STYLES), 500)
  };

  public state: EditorState = {
    files: this.props.value || empty,
    tab: ContentType.CONTENT,
    timestamp: Date.now()
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
    listen('keydown', e => {
      if (e.ctrlKey && e.code === 'Tab') {
        const idx =
          (TabbedEditor.tabs.indexOf(this.state.tab) + 1) %
          TabbedEditor.tabs.length;
        this.tab(TabbedEditor.tabs[idx])();
      }
    });
  }

  public componentWillUnmount() {
    unlisten('keydown');
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
            {_(T.TAB_CONTENT)}
          </button>
          <button className="styles" onClick={this.tab(ContentType.STYLES)}>
            {_(T.TAB_STYLES)}
          </button>
          <button className="metadata" onClick={this.tab(ContentType.METADATA)}>
            {_(T.TAB_METADATA)}
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
