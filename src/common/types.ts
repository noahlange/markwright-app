export enum ContentType {
  CONTENT = 'content',
  STYLES = 'styles',
  METADATA = 'metadata'
}

export interface IError {
  line?: number;
  col?: number;
  message: string;
}

export interface IProject {
  directory: string;
  filename: string | null;
  content: {
    [ContentType.CONTENT]: string;
    [ContentType.STYLES]: string;
    [ContentType.METADATA]: string;
  };
  errors: Record<ContentType, IError[]>;
}
