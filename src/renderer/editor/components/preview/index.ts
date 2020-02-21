import { connect } from 'react-redux';
import Preview from './Preview';
import { AppState } from '@editor/redux/store';
import { ProcessedProject } from '@common/types';

export interface PreviewStateProps {
  data: ProcessedProject;
  scale: number;
  isRearranging: boolean;
}

export interface PreviewOwnProps {
  rearranging: boolean;
}

export interface PreviewDispatchProps {}

function mapState(state: AppState): PreviewStateProps {
  return {
    data: state.data.results,
    scale: state.ui.preview.scale,
    isRearranging: false
  };
}

export type PreviewProps = PreviewStateProps &
  PreviewOwnProps &
  PreviewDispatchProps;

export default connect(mapState)(Preview);
