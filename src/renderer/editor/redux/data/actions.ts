import { ContentType, ProcessedProject } from '@common/types';
import { request, LoadDataResponse, ProcessDataResponse } from './utils';
import { ProjectInfo } from '@main/lib/Project';
import { AppEvents } from '@common/events';

export enum DataActions {
  ON_LOAD = 'ON_LOAD',
  ON_LOAD_RESPONSE = 'ON_LOAD_RESPONSE',
  ON_CHANGE = 'ON_CHANGE',
  ON_PROCESS = 'ON_PROCESS',
  ON_PROCESS_RESPONSE = 'ON_PROCESS_RESPONSE'
}

export interface OnChangeAction<T extends ContentType> {
  type: DataActions.ON_CHANGE;
  data: { type: T; value: string };
}

export interface OnProcessAction<T extends ContentType> {
  type: DataActions.ON_PROCESS;
  data: { type: T; value: string };
}

export interface OnProcessResponseAction<T extends ContentType> {
  type: DataActions.ON_PROCESS_RESPONSE;
  data: ProcessDataResponse<T> & { type: T };
}

export interface OnLoadResponseAction {
  type: DataActions.ON_LOAD_RESPONSE;
  data: {
    initial: Record<ContentType, string>;
    project: ProjectInfo;
    results: ProcessedProject;
  };
}

export interface OnLoadAction {
  type: DataActions.ON_LOAD;
  data: {};
}

export type DataAction =
  | OnChangeAction<ContentType>
  | OnProcessAction<ContentType>
  | OnProcessResponseAction<ContentType>
  | OnLoadResponseAction
  | OnLoadAction;

export function onLoadResponse(data: LoadDataResponse): OnLoadResponseAction {
  return {
    type: DataActions.ON_LOAD_RESPONSE,
    data
  };
}

export function onProcessResponse<T extends ContentType>(
  type: T,
  value: ProcessDataResponse<T>
): OnProcessResponseAction<T> {
  return {
    type: DataActions.ON_PROCESS_RESPONSE,
    data: { type, ...value }
  };
}

export function onChange<T extends ContentType>(
  type: T,
  value: string
): OnChangeAction<T> {
  return {
    type: DataActions.ON_CHANGE,
    data: { type, value }
  };
}

export async function onProcess<T extends ContentType>(
  type: T,
  value: string
): Promise<OnProcessResponseAction<T>> {
  const data = await request<T>(AppEvents.APP_CONTENT_PROCESS, { type, value });
  return onProcessResponse<T>(type, data);
}

export async function onLoad(): Promise<OnLoadResponseAction> {
  const data = await request(AppEvents.APP_LOAD);
  return onLoadResponse(data);
}
