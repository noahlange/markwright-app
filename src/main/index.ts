import { app } from 'electron';
import { homedir } from 'os';

import { Events, AppEvents } from '@common/events';
import App from './lib/App';

let application: App;
let opening: string | null = null;

app.on(Events.OPEN_FILE, (e, path) => {
  e.preventDefault();
  if (application) {
    application.events.handleEvent(e, {
      event: AppEvents.OPEN_FILE,
      payload: { path }
    });
  } else {
    opening = path;
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on(Events.READY, () => {
  application = new App({ app, basedir: homedir(), opening });
});
