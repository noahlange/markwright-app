import { connect } from 'react-redux';

import { ContentType } from '@common/types';
import { AppState } from '@editor/redux/store';
import { changeTab } from '@editor/redux/ui/actions';

import App from './Tabs';

export interface TabsProps {
  tab: ContentType;
}

export interface TabsActions {
  changeTab: typeof changeTab;
}

const stateToProps = (state: AppState): TabsProps => {
  return { tab: state.ui.editor.tab };
};

const dispatchToProps = { changeTab };

export default connect(stateToProps, dispatchToProps)(App);
