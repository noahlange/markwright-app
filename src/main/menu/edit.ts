import _, { T } from '@common/l10n';
import App from '@main/App';

export default function(app: App) {
  return {
    label: _(T.EDIT),
    submenu: [
      { role: 'undo', label: _(T.UNDO), accelerator: 'CmdOrCtrl+Z' },
      { role: 'redo', label: _(T.REDO), accelerator: 'Shift+CmdOrCtrl+Z' },
      { type: 'separator' },
      { role: 'cut', label: _(T.CUT), accelerator: 'CmdOrCtrl+X' },
      { role: 'copy', label: _(T.COPY), accelerator: 'CmdOrCtrl+C' },
      { role: 'undo', label: _(T.PASTE), accelerator: 'CmdOrCtrl+V' },
      { role: 'selectall', label: _(T.SELECT_ALL), accelerator: 'CmdOrCtrl+A' }
    ]
  };
}
