import Events from '@common/events';
import { app } from 'electron';
import App from '../App';

let application: App;
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on(Events.APP_READY, () => {
  application = new App({
    app,
    basedir: process.cwd()
  });
});

// Quit when all windows are closed.
app.on(Events.WINDOW_ALL_CLOSED, async () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on(Events.APP_ACTIVATE, () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (application.window === null) {
    application.createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
