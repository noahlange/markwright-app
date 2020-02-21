import { dialog } from 'electron';
import { PromptResult } from '@main/events/Application';

export const open = async (): Promise<string | undefined> => {
  const res = await dialog.showOpenDialog({
    filters: [
      { name: 'Markwright document', extensions: ['mw'] },
      { name: 'All Files', extensions: ['*'] }
    ]
  });

  return (res.filePaths || []).shift();
};

export const save = async (
  filters: Record<string, string>
): Promise<string | undefined> => {
  const res = await dialog.showSaveDialog({
    filters: Object.entries(filters).reduce(
      (a, [key, name]) => a.concat({ name, extensions: [key] }),
      [] as $AnyFixMe[]
    )
  });
  return res.filePath;
};

const message = (type: string) => async (
  cfg: Electron.MessageBoxOptions
): Promise<PromptResult> => {
  const res = await dialog.showMessageBox({ ...cfg, type });
  return res.response;
};

export const warn = message('warning');
export const error = message('error');
