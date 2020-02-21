import { connect } from 'react-redux';
import Problems from './Problems';
import { AppState } from '@editor/redux/store';
import { ContentType, ProcessorError } from '@common/types';

interface Problem extends ProcessorError {
  type: ContentType;
}

const entries = <O, K extends keyof O, P extends O[K]>(o: O): [K, P][] =>
  Object.entries(o) as [K, P][];

export interface ProblemsStateProps {
  problems: Problem[];
}

function mapState(state: AppState): ProblemsStateProps {
  const problems = entries(state.data.errors).reduce(
    (res: Problem[], [type, value]) => {
      for (const item of value) {
        res.push({ type, ...item });
      }
      return res;
    },
    []
  );

  return { problems };
}

export default connect(mapState)(Problems);
