import { Bounds, DisplayInfo, PositionType } from "./share.model";

export type Option = {
  id: string;
  name: string;
  active: boolean;
  url: string;
  monitor: Partial<DisplayInfo> | null;
  position: Bounds;
  positionType: PositionType;
  customPosition?: Bounds;
  defaultMonitor?: unknown;
  alwaysOnTop?: boolean;
  state?: chrome.windows.windowStateEnum;
}

