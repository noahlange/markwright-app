import App from '@main/App';

export default function(app: App) {
  return {
    label: 'Edit',
    submenu: [
      { role: 'undo', label: 'Undo', accelerator: 'CmdOrCtrl+Z' },
      { role: 'redo', label: 'Redo', accelerator: 'Shift+CmdOrCtrl+Z' },
      { type: 'separator' },
      { role: 'cut', label: 'Cut', accelerator: 'CmdOrCtrl+X' },
      { role: 'copy', label: 'Copy', accelerator: 'CmdOrCtrl+C' },
      { role: 'undo', label: 'Undo', accelerator: 'CmdOrCtrl+V' },
      { role: 'selectall', label: 'Select All', accelerator: 'CmdOrCtrl+A' }
    ]
  };
}
