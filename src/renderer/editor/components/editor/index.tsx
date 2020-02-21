import { connect } from 'react-redux';

import { ContentType } from '@common/types';
import { AppState } from '@editor/redux/store';
import { onChange, onProcess } from '@editor/redux/data/actions';
import { getWindowPctFromTreeLayout } from '@utils/tree';

import Editor from './Editor';
import { Panes } from '../app/App';
import { MosaicParent } from 'react-mosaic-component';

export interface EditorStateProps {
  id: string;
  value: string;
  type: ContentType;
  width: number;
  height: number;
}

export interface EditorDispatchProps {
  onChange: typeof onChange;
  onProcess: typeof onProcess;
}

function mapState(state: AppState): EditorStateProps {
  const type = state.ui.editor.tab;
  const current = state.data.content[type];
  const initial = state.data.initial[type];
  const { width, height } = getWindowPctFromTreeLayout(
    Panes.EDITOR,
    state.ui.window.layout as MosaicParent<Panes>
  );

  return {
    type,
    id: state.data.project.id,
    value: current || initial,
    width: window.innerWidth * width,
    height: window.innerHeight * height
  };
}

const mapDispatch: EditorDispatchProps = {
  onChange,
  onProcess
};

export type EditorProps = EditorStateProps & EditorDispatchProps;

export default connect(mapState, mapDispatch)(Editor);
