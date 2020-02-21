import { connect } from 'react-redux';
import PanZoom from './PanZoom';
import { AppState } from '@editor/redux/store';
import { changePanZoom } from '@editor/redux/ui/actions';

export interface PanZoomOwnProps {}
export interface PanZoomStateProps {
  x: number;
  y: number;
  scale: number;
}

export interface PanZoomDispatchProps {
  onPanZoom: typeof changePanZoom;
}

const mapState = (state: AppState): PanZoomStateProps => {
  return {
    x: state.ui.preview.x,
    y: state.ui.preview.y,
    scale: state.ui.preview.scale
  };
};

const mapDispatch: PanZoomDispatchProps = {
  onPanZoom: changePanZoom
};

export default connect(mapState, mapDispatch)(PanZoom);

export type PanZoomProps = PanZoomOwnProps &
  PanZoomStateProps &
  PanZoomDispatchProps;
