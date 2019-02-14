import React from 'react';
// @ts-ignore
import Markwright from 'markwright';
import { proxy } from 'workly/index';
import cache from 'js-cache';
import { styles } from '../../themes/markwright';
import { ContentType } from '@common/types';

type PreviewProps = {
  base: string;
  data: {
    [ContentType.STYLES]: string;
    [ContentType.CONTENT]: string;
    [ContentType.METADATA]: $AnyFixMe;
  };
};

export default class Preview extends React.Component<PreviewProps> {
  public highlight = proxy('./workers/highlight.worker.js');

  public metadata(key: string, value: $AnyFixMe) {
    return key in this.props.data[ContentType.METADATA]
      ? this.props.data[ContentType.METADATA][key]
      : value;
  }

  public get themeCSS() {
    return styles(this.props.data[ContentType.METADATA], 8.5, 11);
  }

  public render() {
    return (
      <main className="preview">
        <style type="text/css">{this.themeCSS}</style>
        <style type="text/css">{this.props.data[ContentType.STYLES]}</style>
        <Markwright
          config={{
            columns: this.metadata('columns', 1),
            highlight: async (str: string, lang: string) => {
              const key = `${lang}::${str}`;
              const has = cache.get(key);
              if (has) {
                return has;
              } else {
                const res = await this.highlight(str, lang);
                cache.set(key, res);
                return res;
              }
            },
            manual: this.metadata('manual', true),
            page: {
              height: 8.5 * 96,
              width: 11 * 96
            }
          }}
          value={this.props.data[ContentType.CONTENT]}
          page={1}
        />
      </main>
    );
  }
}
