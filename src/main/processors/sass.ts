import sass from 'node-sass';
import cache from 'js-cache';
import { promises } from 'fs';
import path from 'path';

import { IProcessor } from '@main/events/Content';
import App from '@main/App';

const read = promises.readFile;

/**
 * Resolve SASS imports.
 *
 * @todo ditto with the watchlist...
 */
function fetch(base: () => string) {
  return (url: string, prev: string, done: $AnyFixMe) => {
    const p = prev || path.resolve(base(), url);
    const has = cache.get(p);
    if (has) {
      done(has);
    }
    read(p, 'utf8')
      .then(contents => {
        cache.set(p, { contents });
        done({ contents });
      })
      .catch(done);
  };
}

export default class SASSProcessor implements IProcessor {
  public app: App;

  public constructor(app: App) {
    this.app = app;
  }

  public sass(str: string): Promise<string> {
    return new Promise((resolve, reject) => {
      sass.render(
        { data: str, importer: fetch(() => this.app.basedir) },
        (err, res) => {
          err ? reject(err.message) : resolve(res.css.toString());
        }
      );
    });
  }

  public async process(value: string) {
    if (value !== '') {
      try {
        return {
          value: await this.sass(value),
          success: true,
          errors: []
        };
      } catch (e) {
        return {
          value: '',
          success: false,
          errors: [{ message: e }]
        };
      }
    } else {
      return {
        value,
        success: true,
        errors: []
      };
    }
  }
}
