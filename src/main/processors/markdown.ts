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
import Project from '@main/lib/Project';
import { Processor, ProcessResult } from '@common/types';

function fetch(base: string): $AnyFixMe[] {
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

export default class MarkdownProcessor implements Processor {
  public transclude = promisify(transcludeString);
  public project: Project;

  public constructor(project: Project) {
    this.project = project;
  }

  public async process(value: string): Promise<ProcessResult> {
    try {
      const markdown = await this.transclude(value, {
        resolvers: fetch(this.project.directory)
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
