declare module 'line-column';
declare module 'js-cache';
declare module 'hercule';
declare module 'react-electron-web-view';
declare module 'electron-store';
declare module 'electron-devtools-installer';
declare module 'workly/index';
declare module 'markwright';
declare module 'sass';
declare module 'react-shadow';

declare interface Window {
  MonacoEnvironment: {
    getWorkerUrl(id: unknown, label: string): string;
  };
}

declare module 'paper-size' {
  export type PaperSize =
    | 'a0'
    | 'a1'
    | 'a2'
    | 'a3'
    | 'a4'
    | 'a5'
    | 'a6'
    | 'a7'
    | 'a8'
    | 'a9'
    | 'a10'
    | 'b0'
    | 'b1'
    | 'b2'
    | 'b3'
    | 'b4'
    | 'b5'
    | 'b6'
    | 'b7'
    | 'b8'
    | 'b9'
    | 'b10'
    | 'c0'
    | 'c1'
    | 'c2'
    | 'c3'
    | 'c4'
    | 'c5'
    | 'c6'
    | 'c7'
    | 'c8'
    | 'c9'
    | 'c10'
    | 'letter'
    | 'legal'
    | 'half-letter'
    | 'tabloid';
  type PaperSizeOptions =
    | { unit: 'mm' | 'inches' }
    | { unit: 'pixels'; dpi: number };

  export function registerSize(
    name: string,
    mmWidth: number,
    mmHeight: number
  ): void;

  export function getSize(
    size: PaperSize,
    options?: PaperSizeOptions
  ): [number, number];
}

declare type $AnyFixMe = any;
declare type $AnyOK = any;
