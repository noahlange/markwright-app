import { promises } from 'fs';
import cache from 'js-cache';
import sass from 'node-sass';
import path from 'path';

import App from '@main/App';
import { IProcessor } from '@main/events/Content';

const read = promises.readFile;

/**
 * Resolve SASS imports.
 *
 * @todo should add these files to a watchlist, so imports updated outside the
 * application will be updated...
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

  public async process(value: string) {
    if (value !== '') {
      try {
        return {
          errors: [],
          success: true,
          value: await this.sass(value)
        };
      } catch (e) {
        return {
          errors: [{ message: e }],
          success: false,
          value: ''
        };
      }
    } else {
      return {
        errors: [],
        success: true,
        value
      };
    }
  }

  protected sass(str: string): Promise<string> {
    return new Promise((resolve, reject) => {
      sass.render(
        { data: str, importer: fetch(() => this.app.basedir) },
        (err, res) => {
          err ? reject(err.message) : resolve(res.css.toString());
        }
      );
    });
  }
}
