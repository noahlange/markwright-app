enum Events {
  // Electron events
  WINDOW_CLOSED = 'closed',
  WINDOW_ALL_CLOSED = 'window-all-closed',
  WINDOW_RESIZED = 'app-window-resize',
  OPEN_FILE = 'open-file',
  READY = 'ready',
  ACTIVATE = 'activate',

  // Application events
  APP_EVENT = 'app-event',
  APP_CONNECTED = 'app-window-connected',
  APP_READY_EDITOR = 'app-editor-ready',
  APP_READY_PREVIEW = 'app-preview-ready',
  APP_NEW = 'app-project-new',
  APP_LOAD = 'app-project-load',
  APP_FILE = 'app-project-file',
  APP_OPEN_PROMPT = 'app-project-open-prompt',
  APP_OPEN_FILE = 'app-project-open-file',
  APP_SAVE = 'app-project-save',
  APP_EXPORT_PDF = 'app-export-pdf',
  APP_CONTENT_PROCESS = 'app-content-process',
  APP_CONTENT_PROCESSED = 'app-content-processed'
}

export default Events;
