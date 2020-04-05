import { generate } from 'shortid';

import { ContentType } from '@common/types';
import { defaults } from '@main/util/theme';
import { DataState } from './state';
import { DataAction, DataActions } from './actions';

const DEFAULT_STATE: DataState = {
  project: {
    id: generate(),
    filename: '',
    filepath: '',
    directory: '',
    version: null
  },
  initial: {
    [ContentType.CONTENT]: '',
    [ContentType.STYLES]: '',
    [ContentType.METADATA]: ''
  },
  content: {
    [ContentType.CONTENT]: '',
    [ContentType.STYLES]: '',
    [ContentType.METADATA]: ''
  },
  results: {
    [ContentType.CONTENT]: '',
    [ContentType.STYLES]: '',
    [ContentType.METADATA]: { ...defaults }
  },
  errors: {
    [ContentType.CONTENT]: [],
    [ContentType.STYLES]: [],
    [ContentType.METADATA]: []
  }
};

export default function reducer(
  state: DataState = DEFAULT_STATE,
  action?: DataAction
): DataState {
  if (action) {
    switch (action.type) {
      case DataActions.ON_CHANGE:
        return {
          ...state,
          content: {
            ...state.content,
            [action.data.type]: action.data.value
          }
        };
      case DataActions.ON_PROCESS_RESPONSE:
        return {
          ...state,
          results: action.data.success
            ? {
                ...state.results,
                [action.data.type]: action.data.value
              }
            : state.results,
          errors: {
            ...state.errors,
            [action.data.type]: action.data.errors
          }
        };
      // destroy and repopulate data store with newly-loaded data, particularly
      // current edit content
      case DataActions.ON_LOAD_RESPONSE:
        return {
          ...state,
          ...action.data,
          content: action.data.initial
        };
    }
  }
  return state;
}
