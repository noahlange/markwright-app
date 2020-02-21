import { ContentType } from '@common/types';
import { editor, Uri } from 'monaco-editor';
import { MosaicThingy } from '@editor/components/app/App';

export interface UIState {
  preview: {
    scale: number;
    x: number;
    y: number;
  };
  editor: {
    tab: ContentType;
    path: Uri | null;
    views: Map<Uri, editor.IViewState>;
  };
  window: {
    layout: MosaicThingy;
    width: number;
    height: number;
  };
}
