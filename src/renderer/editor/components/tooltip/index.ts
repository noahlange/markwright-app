import { connect } from 'react-redux';
import Tooltip from './tooltip';
import { AppState } from '@editor/redux/store';

export interface TooltipOwnProps {}

export interface TooltipStateProps {
  scale: number;
}

export interface TooltipDispatchProps {}

const mapState = (state: AppState): TooltipStateProps => {
  return {
    scale: state.ui.preview.scale
  };
};

const mapDispatch: TooltipDispatchProps = {};

export default connect(mapState, mapDispatch)(Tooltip);

export type TooltipProps = TooltipOwnProps &
  TooltipStateProps &
  TooltipDispatchProps;
