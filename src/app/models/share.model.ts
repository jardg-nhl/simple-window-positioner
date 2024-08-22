export type DisplayInfo = chrome.system.display.DisplayInfo;
export type Bounds = chrome.system.display.Bounds;
export type UpdateCallBack = (tabId: number, changeInfo: chrome.tabs.TabChangeInfo, tab: chrome.tabs.Tab) => void;
export type PositionType = 'maximized' | 'fullscreen' | 'left-half' | 'right-half' | 'top-half' | 'bottom-half' | 'center';
export type PositionOption = {
  label: PositionType;
  value: PositionType;
};
export type MonitorOption = {
  label: string;
  value: DisplayInfo;
};
export type CustomWorkArea = {
  workArea: Bounds;
  state: chrome.windows.windowStateEnum;
};
