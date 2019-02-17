enum Events {
  DID_FINISH_LOAD = 'did-finish-load',
  WINDOW_CLOSED = 'closed',
  WINDOW_ALL_CLOSED = 'window-all-closed',
  WINDOW_RESIZED = 'app-window-resize',
  OPEN_FILE = 'open-file',

  APP_READY = 'ready',
  APP_ACTIVATE = 'activate',
  APP_DATA_LOADED = 'app-data-loaded',
  APP_RENDER_PROGRESS = 'app-render-progress',
  APP_ALL_READY = 'app-ready',

  APP_EVENT = 'app-event',
  APP_CONNECTED = 'app-window-connected',

  APP_READY_EDITOR = 'app-editor-ready',
  APP_READY_PREVIEW = 'app-preview-ready',

  APP_LOAD = 'app-project-load',
  APP_FILE = 'app-project-file',
  APP_OPEN = 'app-project-open',
  APP_SAVE = 'app-project-save',
  APP_SAVE_AS = 'app-project-save-as',
  APP_EXPORT_PDF = 'app-export-pdf',

  APP_CONTENT_PROCESS = 'app-content-process',
  APP_CONTENT_PROCESSED = 'app-content-processed'
}
export default Events;
