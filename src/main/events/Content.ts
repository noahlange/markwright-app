import Events from '@common/events';
import { ContentType, IError } from '@common/types';
import JSONCProcessor from '@main/processors/jsonc';
import MarkdownProcessor from '@main/processors/markdown';
import SASSProcessor from '@main/processors/sass';

import EventBus from './Bus';

type ContentPayload = {
  type: ContentType;
  value: string;
};

export type ProcessResult = {
  errors: IError[];
  value: string;
  success: boolean;
};

export type ContentResponse = ProcessResult & ContentPayload;

export interface IProcessor {
  process(data: string): Promise<ProcessResult>;
}

export default class extends EventBus {
  public processors: Record<ContentType, IProcessor> = {
    [ContentType.CONTENT]: new MarkdownProcessor(this.app),
    [ContentType.METADATA]: new JSONCProcessor(this.app),
    [ContentType.STYLES]: new SASSProcessor(this.app)
  };

  public events: Events[] = [Events.APP_CONTENT_PROCESS];

  protected async [Events.APP_CONTENT_PROCESS](payload: ContentPayload) {
    const processor = this.processors[payload.type];
    this.app.project.content[payload.type] = payload.value;
    const res = await processor.process(payload.value);
    this.app.emit(Events.APP_CONTENT_PROCESSED, {
      ...res,
      type: payload.type
    });
  }
}
