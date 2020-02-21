import { ProcessorError, ProcessResult } from '@common/types';
import Project from './Project';

export default class Document<O = string> {
  public static from<O>(project: Project, content: string): Document<O> {
    return new Document(project, content);
  }

  public project: Project;
  public result!: ProcessResult<O>;

  public get content(): string {
    return this._content;
  }

  public set content(value: string) {
    this.lastChanged = new Date();
    this._content = value;
  }

  public get value(): O {
    return this.result.value;
  }

  public get errors(): ProcessorError[] {
    return this.result.errors;
  }

  public get isChanged(): boolean {
    return this._initial !== this._content;
  }

  public get isProcessing(): boolean {
    return this.lastChanged > this.lastProcessed;
  }

  protected lastProcessed: Date = new Date();
  protected lastChanged!: Date;

  protected _content!: string;
  protected _value!: ProcessResult<O>;
  protected _initial: string;

  public constructor(project: Project, content: string) {
    this.project = project;
    this.content = this._initial = content;
  }
}
