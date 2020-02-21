import { ContentType, ProcessorError, ProcessedProject } from '@common/types';
import { ProjectInfo } from '@main/lib/Project';

export interface DataState {
  project: ProjectInfo;
  errors: Record<ContentType, ProcessorError[]>;
  content: Record<ContentType, string>;
  results: ProcessedProject;
  initial: Record<ContentType, string>;
}
