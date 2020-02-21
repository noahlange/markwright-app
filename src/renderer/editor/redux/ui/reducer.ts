import { UIState } from './state';
import { UIAction, UIActions } from './actions';
import { ContentType } from '@common/types';

const DEFAULT_UI_STATE: UIState = {
  editor: {
    tab: ContentType.CONTENT,
    path: null,
    views: new Map()
  },
  preview: {
    x: 0,
    y: 0,
    scale: 0.75
  },
  window: {
    layout: null,
    width: 1280,
    height: 820
  }
};

export default function(
  state: UIState = DEFAULT_UI_STATE,
  action: UIAction
): UIState {
  switch (action.type) {
    case UIActions.CHANGE_TAB:
      return {
        ...state,
        editor: {
          ...state.editor,
          tab: action.data.tab
        }
      };
    case UIActions.CHANGE_PAN_ZOOM:
      return {
        ...state,
        preview: {
          ...state.preview,
          ...action.data
        }
      };
    case UIActions.CHANGE_LAYOUT:
      return {
        ...state,
        window: {
          width: window.innerWidth,
          height: window.innerHeight,
          layout: action.data.layout
        }
      };
  }
  return state;
}
