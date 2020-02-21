import React from 'react';
import _, { T } from '@common/l10n';
import { ContentType } from '@common/types';
import { ProblemsStateProps } from '.';

const map: Record<ContentType, { color: string; text: string }> = {
  [ContentType.CONTENT]: {
    color: '#818B92',
    text: _(T.TAB_CONTENT)
  },
  [ContentType.STYLES]: { color: '#9FB69F', text: _(T.TAB_STYLES) },
  [ContentType.METADATA]: {
    color: '#cbb2b2',
    text: _(T.TAB_METADATA)
  }
};

export default class Problems extends React.Component<ProblemsStateProps> {
  public render(): JSX.Element {
    return (
      <pre className="problems">
        {this.props.problems.map(({ type, message }, i) => {
          const { color, text } = map[type];
          return (
            <p key={i}>
              <span style={{ color }}>{text}</span>: {message}
            </p>
          );
        })}
      </pre>
    );
  }
}
