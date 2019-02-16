/**
 * from Satya164's monaco boilerplate, released under the MIT license
 * https://github.com/satya164/monaco-editor-boilerplate
 */

import { ContentType } from '@common/types';
import { listen, unlisten } from '@renderer/utils/listen';

import { autobind } from 'core-decorators';
import * as monaco from 'monaco-editor';
import React from 'react';

type Props = {
  files: { [path: string]: string };
  path: ContentType;
  // value: string;
  onOpenPath?: (path: string) => any;
  onChange: (value: string) => any;
  lineNumbers?: 'on' | 'off';
  wordWrap: 'off' | 'on' | 'wordWrapColumn' | 'bounded';
  scrollBeyondLastLine?: boolean;
  minimap?: {
    enabled?: boolean;
    maxColumn?: number;
    renderCharacters?: boolean;
    showSlider?: 'always' | 'mouseover';
    side?: 'right' | 'left';
  };
  theme?: string;
};

const languages: Record<ContentType, string> = {
  [ContentType.CONTENT]: 'markdown',
  [ContentType.STYLES]: 'scss',
  [ContentType.METADATA]: 'json'
};

export default class Editor extends React.Component<Props> {
  public static states = new Map();
  public static removePath(path: string) {
    // Remove editor states
    Editor.states.delete(path);
    // Remove associated models
    const model = monaco.editor.getModels().find(m => m.uri.path === path);
    if (model) {
      model.dispose();
    }
  }

  public static renamePath(oldPath: string, newPath: string) {
    const selection = Editor.states.get(oldPath);

    Editor.states.delete(oldPath);
    Editor.states.set(newPath, selection);

    this.removePath(oldPath);
  }

  protected editor!: monaco.editor.ICodeEditor;
  protected node!: HTMLDivElement;
  protected subscription: monaco.IDisposable | null = null;

  public componentDidMount() {
    const { path, files, ...rest } = this.props;
    const value = files[path];
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
    this.editor = monaco.editor.create(this.node, {
      ...rest,
      fontFamily: 'Liga Inconsolata',
      fontLigatures: true,
      fontSize: 15,
      theme: 'vs-dark',
      wordWrap: 'bounded'
    });

    (Object.keys(files) as ContentType[]).forEach(f =>
      this.initializeFile(f, this.props.files[f])
    );

    this.openFile(path, value);

    listen('resize', this.updateDimensions);
  }

  @autobind
  public updateDimensions() {
    this.editor.layout();
  }

  @autobind
  public focus() {
    if (!this.editor.hasWidgetFocus) {
      this.editor.focus();
    }
  }

  public componentDidUpdate(prevProps: Props) {
    const { path, ...rest } = this.props;
    const value = this.props.files[path];

    this.editor.updateOptions(rest);

    if (path !== prevProps.path) {
      Editor.states.set(prevProps.path, this.editor.saveViewState());

      this.openFile(path, value);
    } else {
      const m = this.editor.getModel();
      if (m && value !== m.getValue()) {
        const model = this.editor.getModel();
        if (model && value !== m.getValue()) {
          model.pushEditOperations(
            [],
            [
              {
                range: model.getFullModelRange(),
                text: value
              }
            ],
            undefined as $AnyFixMe
          );
        }
      }
    }
  }

  public componentWillUnmount() {
    if (this.editor) {
      this.editor.dispose();
      unlisten('resize');
    }
  }

  public clearSelection() {
    const selection = this.editor.getSelection();
    if (selection) {
      this.editor.setSelection(
        new monaco.Selection(
          selection.startLineNumber,
          selection.startColumn,
          selection.startLineNumber,
          selection.startColumn
        )
      );
    }
  }

  public render() {
    return (
      <div
        id="monaco-container"
        onMouseOver={this.focus}
        style={{ height: '100%', width: '100%' }}
        ref={(r: HTMLDivElement) => (this.node = r)}
        className={this.props.theme}
      />
    );
  }

  @autobind
  protected initializeFile(path: ContentType, value: string) {
    let model = monaco.editor.getModels().find(m => m.uri.path === path);

    if (model) {
      // If a model exists, we need to update it's value
      // This is needed because the content for the file might have been modified externally
      // Use `pushEditOperations` instead of `setValue` or `applyEdits` to preserve undo stack
      model.pushEditOperations(
        [],
        [
          {
            range: model.getFullModelRange(),
            text: value
          }
        ],
        undefined as $AnyFixMe
      );
    } else {
      model = monaco.editor.createModel(
        value,
        languages[path],
        monaco.Uri.from({ path, scheme: 'mw' })
      );
      model.updateOptions({
        insertSpaces: true,
        tabSize: 2
      });
    }
  }

  @autobind
  protected openFile(path: ContentType, value: string = '') {
    this.initializeFile(path, value);

    const model = monaco.editor.getModels().find(m => m.uri.path === path);

    if (model) {
      this.editor.setModel(model);

      // Restore the editor state for the file
      const editorState = Editor.states.get(path);

      if (editorState) {
        this.editor.restoreViewState(editorState);
      }

      this.editor.focus();

      // Subscribe to change in value so we can notify the parent
      if (this.subscription) {
        this.subscription.dispose();
      }

      this.subscription = model.onDidChangeContent(() => {
        const submodel = this.editor.getModel();
        if (submodel) {
          const subvalue = model.getValue();
          this.props.onChange(subvalue);
        }
      });
    }
  }
}
