export enum Events {
  // Electron events
  WINDOW_CLOSED = 'closed',
  WINDOW_ALL_CLOSED = 'window-all-closed',
  WINDOW_RESIZED = 'app-window-resize',
  WINDOW_QUIT = 'before-quit',
  READY = 'ready',
  ACTIVATE = 'activate',
  APP_EVENT = 'app-event',
  OPEN_FILE = 'open-file'
}

export enum AppEvents {
  APP_CLOSE = 'app-close',
  APP_NEW = 'app-project-new',
  APP_LOAD = 'app-project-load',
  APP_FILE = 'app-project-file',
  APP_OPEN = 'app-project-open',
  APP_SAVE = 'app-project-save',
  APP_SAVE_AS = 'app-project-save-as',
  APP_PDF_EXPORT = 'app-pdf-export',
  APP_PDF_EXPORT_READY = 'app-pdf-export-ready',
  APP_PDF_EXPORTED = 'app-pdf-exported',
  APP_CONTENT_PROCESS = 'app-content-process',
  APP_CONTENT_PROCESSED = 'app-content-processed',
  APP_PREVIEW_ERROR = 'app-preview-error'
}
export default Events;
