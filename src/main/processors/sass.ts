import { promises as fs } from 'fs';
import cache from 'js-cache';
import { render } from 'sass';
import path from 'path';

import { Processor, ProcessResult } from '@common/types';
import Project from '@main/lib/Project';

interface SassImporter {
  (url: string, prev: string, done: (res: { contents: string }) => void): void;
}

interface SassOptions {
  data: string;
  importer: SassImporter;
}

interface SassResult {
  css: Buffer;
  success: boolean;
}

const sass = (options: SassOptions): Promise<SassResult> =>
  new Promise((resolve, reject) =>
    render(options, (e: Error, res: SassResult) =>
      e ? reject(e) : resolve(res)
    )
  );

/**
 * Resolve SASS imports.
 *
 * @todo should add these files to a watchlist, so imports updated outside the
 * application will be updated...
 */

export default class SASSProcessor implements Processor {
  public project: Project;

  public constructor(project: Project) {
    this.project = project;
  }

  public async process(data: string): Promise<ProcessResult> {
    try {
      const res = await sass({
        data: data || '',
        importer: (url, prev, done) => {
          // we explicitly *cannot* return this.
          this.fetch(url, prev)
            .then(done)
            .catch(done);
        }
      });
      return {
        success: true,
        errors: [],
        value: res.css.toString()
      };
    } catch (e) {
      return {
        success: false,
        errors: [{ message: e.message }],
        value: ''
      };
    }
  }

  protected async fetch(
    url: string,
    prev: string
  ): Promise<{ contents: string }> {
    const theme = this.project.theme;

    if (url in theme) {
      const name = url as 'markwright' | 'document' | 'variables';
      return { contents: theme[name] };
    }

    const name = cache.has(url)
      ? url
      : prev || path.resolve(this.project.directory, url);

    if (!cache.has(name)) {
      const contents = await fs.readFile(name, 'utf8');
      cache.set(name, { contents });
    }

    return cache.get(name);
  }
}
