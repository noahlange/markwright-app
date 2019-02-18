import App from '@main/App';
import { IProcessor } from '@main/events/Content';

import {
  resolveHttpUrl,
  resolveLocalUrl,
  resolveString,
  transcludeString
} from 'hercule';
import cache from 'js-cache';
import path from 'path';
import toString from 'stream-to-string';
import { promisify } from 'util';

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
        errors: [],
        success: true,
        value: markdown
      };
    } catch (e) {
      return {
        // @todo get lc
        errors: [{ message: e.message, line: 0, col: 0 }],
        success: false,
        value: ''
      };
    }
  }
}
