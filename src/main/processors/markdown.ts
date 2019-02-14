import {
  transcludeString,
  resolveHttpUrl,
  resolveLocalUrl,
  resolveString
} from 'hercule';

import path from 'path';
import cache from 'js-cache';
import toString from 'stream-to-string';
import { promisify } from 'util';
import { IProcessor } from '@main/events/Content';
import App from '@main/App';

function fetch(base: string) {
  return [resolveHttpUrl, resolveLocalUrl, resolveString].map(resolve => {
    return (url: string) => {
      const has = cache.get(url);
      if (has) {
        return has;
      } else {
        const res = resolve(path.resolve(base, url), '/');
        if (res) {
          toString(res.content).then((r: string) =>
            cache.set(url, { url, content: r })
          );
          return res;
        }
      }
      return null;
    };
  });
}

export default class MarkdownProcessor implements IProcessor {
  public transclude = promisify(transcludeString);
  public app: App;

  public constructor(app: App) {
    this.app = app;
  }

  public async process(value: string) {
    try {
      const markdown = await this.transclude(value, {
        resolvers: fetch(this.app.basedir)
      });
      return {
        value: markdown,
        success: true,
        errors: []
      };
    } catch (e) {
      return {
        value: '',
        success: false,
        // @todo get lc
        errors: [{ message: e.message, line: 0, col: 0 }]
      };
    }
  }
}
