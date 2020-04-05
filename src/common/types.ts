import { MenuItemConstructorOptions } from 'electron';
import { PaperSize } from 'paper-size';

export enum ContentType {
  CONTENT = 'content',
  STYLES = 'styles',
  METADATA = 'metadata'
}

export interface ProcessorError {
  line?: number;
  col?: number;
  message: string;
}

export interface ProcessedProject {
  [ContentType.CONTENT]: string;
  [ContentType.STYLES]: string;
  [ContentType.METADATA]: ProjectMetadata;
}

interface ColumnConfig {
  columns:
    | 1
    | {
        count: number;
        gutter: string;
      };
}

interface PaperDimensions {
  paper: {
    width: string;
    height: string;
  };
}

interface PaperInfo {
  paper: PaperSize;
  orientation: 'portrait' | 'letter';
}
export interface Margins {
  bottom: string;
  inner: string;
  outer: string;
  top: string;
}

export interface BaseMetadata {
  dpi: number;
  manual: boolean;
  margins: Margins;
}

export type ProjectMetadata = BaseMetadata &
  ColumnConfig &
  (PaperInfo | PaperDimensions);

export type MenuShorthand = MenuItemConstructorOptions;

interface ContentPayload {
  type: ContentType;
  value: string;
}

export interface ProcessResult<O = string> {
  errors: ProcessorError[];
  value: O;
  success: boolean;
}

export interface Processor<O = string> {
  process(data: string): Promise<ProcessResult<O>>;
}

export type ContentResponse = ProcessResult & ContentPayload;
