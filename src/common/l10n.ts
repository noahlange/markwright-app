export enum T {
  BTN_CANCEL,
  BTN_DELETE,
  BTN_SAVE,
  EDIT,
  FILE,
  NEW,
  OPEN,
  OPEN_RECENT,
  CLEAR_MENU,
  SAVE,
  EXPORT_TO_PDF,
  UNDO,
  REDO,
  CUT,
  COPY,
  PASTE,
  SELECT_ALL,
  SAVE_AS_DETAIL,
  SAVE_AS_MESSAGE,
  PANE_CONTENT,
  PANE_PROBLEMS,
  PANE_PREVIEW,
  TAB_CONTENT,
  TAB_STYLES,
  TAB_METADATA
}

export const en: Record<T, string> = {
  [T.BTN_CANCEL]: 'Cancel',
  [T.BTN_DELETE]: 'Delete',
  [T.BTN_SAVE]: 'Save',
  [T.EDIT]: 'Edit',
  [T.FILE]: 'File',
  [T.NEW]: 'New',
  [T.UNDO]: 'Undo',
  [T.REDO]: 'Redo',
  [T.CUT]: 'Cut',
  [T.COPY]: 'Copy',
  [T.PASTE]: 'Paste',
  [T.SELECT_ALL]: 'Select All',
  [T.NEW]: 'New',
  [T.OPEN]: 'Open',
  [T.OPEN_RECENT]: 'Open Recent',
  [T.CLEAR_MENU]: 'Clear Menu',
  [T.SAVE]: 'Save',
  [T.EXPORT_TO_PDF]: 'Export to PDF',
  [T.SAVE_AS_DETAIL]:
    "You can choose to save your changes, or delete this document immediately. You can't undo this action.",
  [T.SAVE_AS_MESSAGE]: 'Do you want to keep "%s.mw"?',
  [T.PANE_CONTENT]: 'Content',
  [T.PANE_PROBLEMS]: 'Problems',
  [T.PANE_PREVIEW]: 'Preview',
  [T.TAB_CONTENT]: 'Markdown',
  [T.TAB_STYLES]: 'SCSS',
  [T.TAB_METADATA]: 'JSON'
};

export default function _(str: T, ...args: any[]) {
  const res = en[str];
  return res.replace('%s', () => args.shift());
}
