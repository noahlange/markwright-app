import { parse, ParseError, ParseErrorCode } from 'jsonc-parser';
import lc from 'line-column';
import { ProcessResult, Processor, ProjectMetadata } from '@common/types';
import Project from '@main/lib/Project';

/**
 * Babel doesn't understand const enums, therefore we're using the number literals.
 */
const ParseErrors: Record<ParseErrorCode, string> = {
  [1]: 'Invalid symbol',
  [2]: 'Invalid number format',
  [3]: 'Property name expected',
  [4]: 'Value expected',
  [5]: 'Colon expected',
  [6]: 'Comma expected',
  [7]: 'Closing brace expected',
  [8]: 'Closing bracket expected',
  [9]: 'End-of-file expected',
  [10]: 'Invalid comment token',
  [11]: 'Unexpected end of comment',
  [12]: 'Unexpected end of string',
  [13]: 'Unexpected end of number',
  [14]: 'Invalid unicode',
  [15]: 'Invalid escape character',
  [16]: 'Invalid character'
};

export default class JSONCProcessor implements Processor<ProjectMetadata> {
  public project: Project;

  public constructor(project: Project) {
    this.project = project;
  }
  public async process(
    content: string
  ): Promise<ProcessResult<ProjectMetadata>> {
    const errors: ParseError[] = [];
    const value = parse(content, errors);
    return {
      errors: errors.map(e => {
        const { line, col } = lc(content, e.offset) || { line: 0, col: 0 };
        return {
          col,
          line,
          message: `JSON Parse error: ${ParseErrors[e.error]}`
        };
      }),
      success: !errors.length,
      value
    };
  }
}
