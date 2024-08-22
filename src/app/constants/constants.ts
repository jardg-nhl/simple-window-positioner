import { CustomWorkArea, DisplayInfo, PositionType } from "../models/share.model";

export const LANGUAGES = {
  EN: 'en',
  JP: 'jp'
};

export const DEFAULT_POSITION = {
  left: 0,
  top: 0,
  width: 0,
  height: 0
};

export const MAXIMIZED = 'maximized';
export const FULLSCREEN = 'fullscreen';
export const LEFT_HALF = 'left-half';
export const RIGHT_HALF = 'right-half';
export const TOP_HALF = 'top-half';
export const BOTTOM_HALF = 'bottom-half';
export const CENTER = 'center';
export const POSITION_TYPES: PositionType[] = [MAXIMIZED, FULLSCREEN, LEFT_HALF, RIGHT_HALF, TOP_HALF, BOTTOM_HALF, CENTER];

export const calculateCustomWorkArea = (positionType: PositionType, displayInfo: DisplayInfo): CustomWorkArea => {
  if (!displayInfo || !positionType) {
    return {workArea: null as any, state: MAXIMIZED};
  }
  const display = JSON.parse(JSON.stringify(displayInfo));
  switch (positionType) {
    case MAXIMIZED:
      return {workArea: display.workArea, state: MAXIMIZED};
    case FULLSCREEN:
      return {workArea: display.workArea, state: FULLSCREEN};
    case LEFT_HALF:
      display.workArea.width /= 2;
      return {workArea: display.workArea, state: 'normal'};
    case RIGHT_HALF:
      display.workArea.width /= 2;
      display.workArea.left += display.workArea.width;
      return {workArea: display.workArea, state: 'normal'};
    case TOP_HALF:
      display.workArea.height /= 2;
      return {workArea: display.workArea, state: 'normal'};
    case BOTTOM_HALF:
      display.workArea.height /= 2;
      display.workArea.top += display.workArea.height;
      return {workArea: display.workArea, state: 'normal'};
    case CENTER:
      display.workArea.height /= 2;
      display.workArea.width /= 2;
      display.workArea.left += display.workArea.width / 2;
      display.workArea.top += display.workArea.height / 2;
      return {workArea: display.workArea, state: 'normal'};
    default:
      return {workArea: display.workArea, state: MAXIMIZED};
  }
}
