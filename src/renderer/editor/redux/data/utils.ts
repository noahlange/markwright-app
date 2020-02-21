import { ipcRenderer as ipc } from 'electron';
import { ProcessorError, ContentType, ProcessedProject } from '@common/types';
import { ProjectInfo } from '@main/lib/Project';
import Events, { AppEvents } from '@common/events';

export interface ProcessDataPayload {
  type: ContentType;
  value: string;
}

export interface ProcessDataResponse<T extends ContentType> {
  type: T;
  success: boolean;
  value: ProcessedProject[T];
  errors: ProcessorError[];
}

export interface LoadDataResponse {
  initial: {
    [ContentType.CONTENT]: string;
    [ContentType.METADATA]: string;
    [ContentType.STYLES]: string;
  };
  results: ProcessedProject;
  project: ProjectInfo;
}

function request(event: AppEvents.APP_LOAD): Promise<LoadDataResponse>;
function request<T extends ContentType>(
  event: AppEvents.APP_CONTENT_PROCESS,
  payload: ProcessDataPayload
): Promise<ProcessDataResponse<T>>;
function request(event: AppEvents, payload: object = {}): Promise<unknown> {
  return new Promise(resolve => {
    ipc.once(event, (_, res) => resolve(res));
    ipc.send(Events.APP_EVENT, { event, payload });
  });
}

export { request };
