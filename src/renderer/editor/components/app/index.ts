import { connect } from 'react-redux';

import { AppState } from '@editor/redux/store';
import { changeLayout } from '@editor/redux/ui/actions';
import { onLoad } from '@editor/redux/data/actions';

import App from './App';

export interface AppStateProps {
  filename: string;
}

export interface AppDispatchProps {
  layout: typeof changeLayout;
  onLoad: typeof onLoad;
}

function mapProps(state: AppState): AppStateProps {
  return { filename: state.data.project.filename };
}

const mapDispatch = {
  layout: changeLayout,
  onLoad
};

export type AppProps = AppStateProps & AppDispatchProps;

export default connect(mapProps, mapDispatch)(App);
