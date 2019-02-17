import Events from '@common/events';
import { app } from 'electron';
import { homedir } from 'os';
import App from '../App';

let application: App;
let opening: string | null = null;

app.on(Events.OPEN_FILE, (e, path) => {
  e.preventDefault();
  opening = path;
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on(Events.APP_READY, () => {
  application = new App({ app, basedir: homedir(), opening });
});
