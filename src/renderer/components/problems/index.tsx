import * as React from 'react';
import { ContentType, IError } from '@common/types';

type ProblemsProps = {
  data: Record<ContentType, IError[]>;
};

type ProblemsState = {
  tab: ContentType;
};

const tabs: ContentType[] = [
  ContentType.STYLES,
  ContentType.CONTENT,
  ContentType.METADATA
];

const styles = {
  [ContentType.CONTENT]: {
    color: '#818B92'
  },
  [ContentType.METADATA]: {
    color: '#cbb2b2'
  },
  [ContentType.STYLES]: {
    color: '#9FB69F'
  }
};

export default class Problems extends React.Component<
  ProblemsProps,
  ProblemsState
> {
  public state: ProblemsState = { tab: ContentType.CONTENT };

  public problems(tab: ContentType = this.state.tab): IError[] {
    return this.props.data[tab] || [];
  }

  public tab(tab: ContentType) {
    return () => this.setState({ tab });
  }

  public render() {
    const problems = tabs.reduce(
      (a, tab) => a.concat(this.problems(tab).map(e => ({ tab, ...e }))),
      [] as Array<{ tab: ContentType } & IError>
    );
    return (
      <div>
        <pre className="problems">
          {problems.map(({ tab, message }, i) => {
            return (
              <p key={i}>
                <span style={styles[tab]}>{tab}</span>: {message}
              </p>
            );
          })}
        </pre>
      </div>
    );
  }
}
