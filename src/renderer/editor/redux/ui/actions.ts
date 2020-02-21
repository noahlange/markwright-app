import { ContentType } from '@common/types';
import { MosaicThingy } from '@editor/components/app/App';
import { PanZoomInfo } from '@editor/components/pan-zoom/PanZoom';

export enum UIActions {
  CHANGE_TAB = 'CHANGE_TAB',
  CHANGE_PAN_ZOOM = 'CHANGE_PAN_ZOOM',
  TOGGLE_POPOVER = 'TOGGLE_POPOVER',
  CHANGE_LAYOUT = 'CHANGE_LAYOUT'
}

export interface ChangeTabAction {
  type: UIActions.CHANGE_TAB;
  data: {
    tab: ContentType;
  };
}

export interface ChangePanZoomAction {
  type: UIActions.CHANGE_PAN_ZOOM;
  data: PanZoomInfo;
}

export interface TogglePopoverAction {
  type: UIActions.TOGGLE_POPOVER;
  data: {};
}

export interface ChangeLayoutAction {
  type: UIActions.CHANGE_LAYOUT;
  data: { layout: MosaicThingy };
}

export function changeTab(tab: ContentType): ChangeTabAction {
  return {
    type: UIActions.CHANGE_TAB,
    data: { tab }
  };
}

export function changePanZoom(info: PanZoomInfo): ChangePanZoomAction {
  return {
    type: UIActions.CHANGE_PAN_ZOOM,
    data: info
  };
}

export function togglePopover(): TogglePopoverAction {
  return {
    type: UIActions.TOGGLE_POPOVER,
    data: {}
  };
}
export function changeLayout(layout: MosaicThingy): ChangeLayoutAction {
  return {
    type: UIActions.CHANGE_LAYOUT,
    data: { layout }
  };
}

export type UIAction =
  | ChangeTabAction
  | ChangePanZoomAction
  | TogglePopoverAction
  | ChangeLayoutAction;
